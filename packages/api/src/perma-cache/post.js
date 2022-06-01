/* eslint-env serviceworker, browser */
/* global Response */

import {
  MAX_ALLOWED_URL_LENGTH,
  INVALID_PERMA_CACHE_CACHE_CONTROL_DIRECTIVES,
} from '../constants.js'
import {
  InvalidUrlError,
  TimeoutError,
  HTTPError,
  ExpectationFailedError,
} from '../errors.js'
import { JSONResponse } from '../utils/json-response.js'
import { normalizeCid } from '../utils/cid.js'

/**
 * @typedef {import('../env').Env} Env
 * @typedef {{ userId: string, r2Key: string, date: string }} Key
 *
 * @typedef {Object} IpfsUrlParts
 * @property {string} cid
 * @property {string} url
 * @property {string} path
 */

/**
 * Handle perma-cache post request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCachePost(request, env) {
  const sourceUrl = getSourceUrl(request, env)
  const normalizedUrl = getNormalizedUrl(sourceUrl, env)
  const r2Key = normalizedUrl.toString()
  const userId = request.auth.user.id

  // Checking if existent does not protect us of concurrent perma-cache
  // but avoids downloading content to fail later.
  const existing = await env.db.getPermaCache(userId, normalizedUrl.toString())
  if (existing) {
    throw new HTTPError('The provided URL was already perma-cached', 400)
  }

  // Fetch Response from provided URL
  const response = await getResponse(request, env, normalizedUrl)
  validateCacheControlHeader(response.headers.get('Cache-Control') || '')

  // Store in R2 and add to Database if not existent
  const r2Object = await env.SUPERHOT.put(r2Key, response.body, {
    httpMetadata: response.headers,
  })

  // Will fail on concurrent perma-cache of pair (userId, url)
  const data = await env.db.createPermaCache({
    userId,
    sourceUrl: sourceUrl.toString(),
    normalizedUrl: normalizedUrl.toString(),
    size: r2Object.size,
  })

  return new JSONResponse({
    url: sourceUrl.toString(),
    size: r2Object.size,
    insertedAt: data,
  })
}

/**
 * Fetch Response from provided URL.
 * @param {Request} request
 * @param {Env} env
 * @param {URL} url
 */
async function getResponse(request, env, url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.REQUEST_TIMEOUT)
  let response
  try {
    response = await env.GATEWAY.fetch(url.toString(), {
      signal: controller.signal,
      headers: getHeaders(request),
    })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new TimeoutError()
    }
    throw error
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    throw new HTTPError(
      'Failed to get response from provided URL',
      response.status
    )
  }

  // Content length is mandatory given R2 needs a known size of the readable stream
  // TODO: We need public gateways to set content-length for JSON content (maybe others)
  // https://github.com/protocol/bifrost-infra/issues/1868
  const contentLengthMb = response.headers.get('content-length')
  if (!contentLengthMb) {
    const headers = response.headers
    const content = await response.blob()

    response = new Response(content, {
      headers: headers,
    })
  }

  return response
}

/**
 * Verify if provided url is a valid nftstorage.link URL
 * Returns subdomain format.
 *
 * @param {Request} request
 * @param {Env} env
 */
export function getSourceUrl(request, env) {
  let candidateUrl
  try {
    candidateUrl = new URL(decodeURIComponent(request.params.url))
  } catch (err) {
    throw new InvalidUrlError(
      `invalid URL provided: ${request.params.url}: ${err.message}`
    )
  }

  const urlString = candidateUrl.toString()
  if (urlString.length > MAX_ALLOWED_URL_LENGTH) {
    throw new InvalidUrlError(
      `invalid URL provided: ${request.params.url}: maximum allowed length or URL is ${MAX_ALLOWED_URL_LENGTH}`
    )
  }
  if (!urlString.includes(env.GATEWAY_DOMAIN)) {
    throw new InvalidUrlError(
      `invalid URL provided: ${urlString}: not nftstorage.link URL`
    )
  }

  return candidateUrl
}

/**
 * Verify if candidate url has IPFS path or IPFS subdomain, returning subdomain format.
 *
 * @param {URL} candidateUrl
 * @param {Env} env
 */
export function getNormalizedUrl(candidateUrl, env) {
  // Verify if IPFS path resolution URL
  const ipfsPathParts = candidateUrl.pathname.split('/ipfs/')
  if (ipfsPathParts.length > 1) {
    const pathParts = ipfsPathParts[1].split(/\/(.*)/s)
    const cid = getCid(pathParts[0])

    // Parse path + query params
    const path = pathParts[1] ? `/${pathParts[1]}` : ''
    const queryParamsCandidate = candidateUrl.searchParams.toString()
    const queryParams = queryParamsCandidate.length
      ? `?${queryParamsCandidate}`
      : ''

    return new URL(
      `${candidateUrl.protocol}//${cid}.ipfs.${env.GATEWAY_DOMAIN}${path}${queryParams}`
    )
  }

  // Verify if subdomain resolution URL
  const subdomainParts = candidateUrl.hostname.split('.ipfs.')
  if (subdomainParts.length <= 1) {
    throw new InvalidUrlError(
      `invalid URL provided: ${candidateUrl}: not subdomain nor ipfs path available`
    )
  }

  return candidateUrl
}

/**
 * @param {string} candidateCid
 */
function getCid(candidateCid) {
  try {
    return normalizeCid(candidateCid)
  } catch (err) {
    throw new InvalidUrlError(`invalid CID: ${candidateCid}: ${err.message}`)
  }
}

/**
 * Validates cache control header to verify if we should perma cache the response.
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 * @param {string} cacheControl
 */
function validateCacheControlHeader(cacheControl) {
  INVALID_PERMA_CACHE_CACHE_CONTROL_DIRECTIVES.forEach((directive) => {
    if (cacheControl.includes(directive)) {
      throw new ExpectationFailedError(
        'Expectation failed with cache control header content'
      )
    }
  })
}

/**
 * @param {Request} request
 */
function getHeaders(request) {
  const headers = cloneHeaders(request.headers)
  const existingProxies = headers.get('X-Forwarded-For')
    ? `, ${headers.get('X-Forwarded-For')}`
    : ''

  // keep headers
  headers.set(
    'X-Forwarded-For',
    `${headers.get('cf-connecting-ip')}${existingProxies}`
  )

  return headers
}

/**
 * Clone headers to mutate them.
 *
 * @param {Headers} reqHeaders
 */
function cloneHeaders(reqHeaders) {
  const headers = new Headers()
  for (var kv of reqHeaders.entries()) {
    headers.append(kv[0], kv[1])
  }
  return headers
}
