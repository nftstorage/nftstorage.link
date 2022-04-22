/* eslint-env serviceworker, browser */
/* global Response */

import { InvalidUrlError, TimeoutError } from '../errors.js'
import { JSONResponse } from '../utils/json-response.js'
import { normalizeCid } from '../utils/cid.js'

/**
 * @typedef {import('../env').Env} Env
 * @typedef {Object} IpfsUrlParts
 * @property {string} cid
 * @property {string} url
 * @property {string} path
 */

/**
 * Handle perma-cache put request
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('..').Ctx} ctx
 */
export async function permaCachePut(request, env, ctx) {
  const sourceUrl = getSourceUrl(request, env)
  const normalizedUrl = getNormalizedUrl(sourceUrl, env)

  // TODO: Validate if user has enough space?
  // TODO: validate if we already have it in R2

  // Fetch Response from provided URL
  const response = await getResponse(request, env, normalizedUrl)
  if (!response.ok) {
    // TODO: Formatted error
    throw new Error(`response not ok: ${response.status}`)
  }

  // TODO: Validate headers

  // Store key with user namespace to handle concurrency and keeping track of all
  const kvKey = `${request.auth.user.id}/${normalizedUrl.toString()}`
  const kvValue = {
    sourceUrl: sourceUrl.toString(),
    normalizedUrl: normalizedUrl.toString(),
    contentLength: response.headers.get('content-length'),
    insertedAt: new Date().toISOString(),
    deletedAt: undefined,
  }

  // Store in R2 and add to Database if not existent
  await env.SUPERHOT.put(normalizedUrl.toString(), response.body, {
    httpMetadata: response.headers,
  })

  // Store in KV
  await env.PERMACACHE.put(kvKey, JSON.stringify(kvValue))

  return new JSONResponse(kvValue)
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
    response = await fetch(url.toString(), {
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
  return response
}

/**
 * Verify if provided url is a valid nftstorage.link URL
 * Returns subdomain format.
 *
 * @param {Request} request
 * @param {Env} env
 */
function getSourceUrl(request, env) {
  let candidateUrl
  try {
    candidateUrl = new URL(decodeURIComponent(request.params.url))
  } catch (err) {
    throw new InvalidUrlError(
      `invalid URL provided: ${request.params.url}: ${err.message}`
    )
  }

  const urlString = candidateUrl.toString()
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
function getNormalizedUrl(candidateUrl, env) {
  const urlString = candidateUrl.toString()

  // Verify if IPFS path resolution URL
  const ipfsPathParts = urlString.split('/ipfs/')
  if (ipfsPathParts.length > 1) {
    const pathParts = ipfsPathParts[1].split(/\/(.*)/s)
    const cid = getCid(pathParts[0])
    const path = pathParts[1] ? `/${pathParts[1]}` : ''
    // TODO: handle query params
    return new URL(
      `${candidateUrl.protocol}//${cid}.ipfs.${env.GATEWAY_DOMAIN}${path}`
    )
  }

  // Verify if subdomain resolution URL
  const subdomainParts = candidateUrl.hostname.split('.ipfs.')
  if (subdomainParts.length <= 1) {
    throw new InvalidUrlError(
      `invalid URL provided: ${candidateUrl}: not subdomain nor ipfs path available`
    )
  }

  // TODO: handle query params
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
 * @param {Request} request
 */
function getHeaders(request) {
  const existingProxies = request.headers.get('X-Forwarded-For')
    ? `, ${request.headers.get('X-Forwarded-For')}`
    : ''
  return {
    'X-Forwarded-For': `${request.headers.get(
      'cf-connecting-ip'
    )}${existingProxies}`,
  }
}
