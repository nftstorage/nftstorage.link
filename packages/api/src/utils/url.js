import { MAX_ALLOWED_URL_LENGTH } from '../constants.js'
import { InvalidUrlError } from '../errors.js'

import { normalizeCid } from './cid.js'

/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Parses provided URL and verifes if is a valid nftstorage.link URL
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
  if (
    !env.gatewayDomains.filter((gwDomain) => urlString.includes(gwDomain))
      .length
  ) {
    throw new InvalidUrlError(
      `invalid URL provided: ${urlString}: not ${env.gatewayDomains.join(
        ' or '
      )} URL`
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

    // Always set normalized url as first URL in supported gateway domains (w3s.link)
    return new URL(
      `${candidateUrl.protocol}//${cid}.ipfs.${env.gatewayDomains[0]}${path}${queryParams}`
    )
  }

  // Verify if subdomain resolution URL
  const subdomainParts = candidateUrl.hostname.split('.ipfs.')
  if (subdomainParts.length <= 1) {
    throw new InvalidUrlError(
      `invalid URL provided: ${candidateUrl}: not subdomain nor ipfs path available`
    )
  }

  const candidateUrlDomain = env.gatewayDomains.find((gwDomain) =>
    candidateUrl.host.endsWith(gwDomain)
  )
  if (!candidateUrlDomain) {
    throw new InvalidUrlError(`invalid URL provided: ${candidateUrl}`)
  }

  return new URL(
    // Always set normalized url as first URL in supported gateway domains (w3s.link)
    candidateUrl.toString().replace(candidateUrlDomain, env.gatewayDomains[0])
  )
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
