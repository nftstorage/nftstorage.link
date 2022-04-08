/* eslint-env serviceworker, browser */
/* global Response */

import { normalizeCid } from './utils//cid.js'
import { getIpfsGatewayHeaders } from './utils/headers.js'
import { InvalidUrlError, TimeoutError } from './errors.js'

/**
 * @typedef {import('./env').Env} Env
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
 * @param {import('./index').Ctx} ctx
 */
export async function permaCachePut(request, env, ctx) {
  const url = parseCandidateUrl(request)

  // TODO: should we always transform to subdomain? or probably match on /ipfs, but no domain isolation
  // TODO: validate if we already have it in perma-cache

  // Fetch Response from provided URL
  const response = await getResponse(request, env, url)

  // TODO: Store in Parallel to R2 and add to Database if not existent
  // Rollback if R2 fails

  return new Response()
}

/**
 * Verify if provided url is a valid nftstorage.link URL with IPFS path or IPFS subdomain.
 * Returns subdomain format.
 *
 * @param {Request} request
 */
function parseCandidateUrl(request) {
  // TODO From env
  // const GATEWAY_DOMAIN = 'nftstorage.link'
  const GATEWAY_DOMAIN = 'localhost:8787'
  let candidateUrl
  try {
    candidateUrl = new URL(decodeURIComponent(request.params.url))
  } catch (err) {
    throw new InvalidUrlError(
      `invalid URL provided: ${request.params.url}: ${err.message}`
    )
  }

  const urlString = candidateUrl.toString()
  if (!urlString.includes(GATEWAY_DOMAIN)) {
    throw new InvalidUrlError(
      `invalid URL provided: ${candidateUrl}: not nftstorage.link URL`
    )
  }

  // Verify if IPFS path resolution URL
  const ipfsPathParts = urlString.split('/ipfs/')
  if (ipfsPathParts.length > 1) {
    const pathParts = ipfsPathParts[1].split(/\/(.*)/s)
    const cid = getCid(pathParts[0])
    const path = pathParts[1] ? `/${pathParts[1]}` : ''
    // TODO: handle query params
    return `https://${cid}.${GATEWAY_DOMAIN}${path}`
  }

  // Verify if subdomain resolution URL
  const subdomainParts = candidateUrl.hostname.split('.ipfs.')
  if (subdomainParts.length <= 1) {
    throw new InvalidUrlError(
      `invalid URL provided: ${candidateUrl}: not subdomain nor ipfs path available`
    )
  }

  // TODO: handle query params
  return candidateUrl.toString()
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
 * Fetch Response from provided URL.
 * @param {Request} request
 * @param {Env} env
 * @param {string} url
 */
async function getResponse(request, env, url) {
  return new Response(new Blob(['ola']))

  // TODO: ENV var
  const timeout = 60000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  let response
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: getIpfsGatewayHeaders(request),
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
