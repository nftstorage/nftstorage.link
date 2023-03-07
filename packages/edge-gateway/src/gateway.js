/* eslint-env serviceworker, browser */

import pRetry from 'p-retry'
import { CID } from 'multiformats/cid'

import { InvalidUrlError } from './errors.js'

const GOODBITS_BYPASS_TAG = 'https://nftstorage.link/tags/bypass-default-csp'
const IPFS_GATEWAYS = [
  'https://*.w3s.link',
  'https://*.nftstorage.link',
  'https://*.dweb.link',
  'https://ipfs.io/ipfs/',
]
const ALLOWED_LIST = [
  'https://*.githubusercontent.com',
  'https://polygon-rpc.com',
  'https://rpc.testnet.fantom.network',
]

/**
 * Handle gateway requests
 *
 * @param {Request} request
 * @param {import('./env').Env} env
 */
export async function gatewayGet(request, env) {
  // Redirect if ipns
  if (request.url.includes(env.IPNS_GATEWAY_HOSTNAME)) {
    return Response.redirect(
      request.url.replace(env.IPNS_GATEWAY_HOSTNAME, 'ipns.dweb.link'),
      302
    )
  }

  const response = await env.EDGE_GATEWAY.fetch(request.url, {
    headers: request.headers,
    cf: {
      ...(request.cf || {}),
      // @ts-ignore custom entry in cf object
      onlyIfCachedGateways: JSON.stringify(['https://w3s.link']),
    },
    redirect: 'manual',
  })

  if (response.redirected) {
    return response
  }

  // Validation layer - CSP bypass
  const resourceCid = decodeURIComponent(
    response.headers.get('etag') || getCidFromSubdomainUrl(new URL(request.url))
  )
  const goodbitsTags = await getTagsFromGoodbitsList(
    env.GOODBITSLIST,
    resourceCid
  )
  if (goodbitsTags.includes(GOODBITS_BYPASS_TAG)) {
    return response
  }

  return getTransformedResponseWithCspHeaders(response, env)
}

/**
 * Transforms response with custom headers.
 * Content-Security-Policy header specified to only allow requests within same origin.
 *
 * @param {Response} response
 * @param {import('./bindings').Env} env
 */
function getTransformedResponseWithCspHeaders(response, env) {
  const clonedResponse = new Response(response.body, response)
  const defaultSrc = `'self' 'unsafe-inline' 'unsafe-eval' blob: data: ${IPFS_GATEWAYS.join(
    ' '
  )} ${ALLOWED_LIST.join(' ')}`
  const connectSrc = `'self' blob: data: ${IPFS_GATEWAYS.join(
    ' '
  )} ${ALLOWED_LIST.join(' ')}`
  const reportUri = env.CSP_REPORT_URI

  clonedResponse.headers.set(
    'content-security-policy',
    `default-src ${defaultSrc} ; form-action 'self'; navigate-to 'self'; connect-src ${connectSrc} ; report-to csp-endpoint ; report-uri ${reportUri}`
  )

  reportUri &&
    clonedResponse.headers.set(
      'reporting-endpoints',
      `csp-endpoint="${reportUri}"`
    )

  return clonedResponse
}

/**
 * Get a given entry from the goodbits list if CID exists, and return tags
 *
 * @param {KVNamespace} datastore
 * @param {string} cid
 */
async function getTagsFromGoodbitsList(datastore, cid) {
  if (!datastore || !cid) {
    return []
  }

  // TODO: Remove once https://github.com/nftstorage/nftstorage.link/issues/51 is fixed
  const goodbitsEntry = await pRetry(() => datastore.get(cid), { retries: 5 })

  if (goodbitsEntry) {
    const { tags } = JSON.parse(goodbitsEntry)
    return Array.isArray(tags) ? tags : []
  }

  return []
}

/**
 * Parse subdomain URL and return cid.
 *
 * @param {URL} url
 */
export function getCidFromSubdomainUrl(url) {
  // Replace "ipfs-staging" by "ipfs" if needed
  const host = url.hostname.replace('ipfs-staging', 'ipfs')
  const splitHost = host.split('.ipfs.')

  if (!splitHost.length) {
    throw new InvalidUrlError(url.hostname)
  }

  let cid
  try {
    cid = CID.parse(splitHost[0])
  } catch (/** @type {any} */ err) {
    throw new InvalidUrlError(`invalid CID: ${splitHost[0]}: ${err.message}`)
  }

  return cid.toV1().toString()
}
