/* eslint-env serviceworker, browser */

import pRetry from 'p-retry'

const GOODBITS_BYPASS_TAG = 'https://nftstorage.link/tags/bypass-default-csp'

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
  })

  // Validation layer - CSP bypass
  const resourceCid = decodeURIComponent(response.headers.get('etag') || '')
  const goodbitsTags = await getTagsFromGoodbitsList(
    env.GOODBITSLIST,
    resourceCid
  )
  if (goodbitsTags.includes(GOODBITS_BYPASS_TAG)) {
    return response
  }

  return getTransformedResponseWithCspHeaders(response)
}

/**
 * Transforms response with custom headers.
 * Content-Security-Policy header specified to only allow requests within same origin.
 *
 * @param {Response} response
 */
function getTransformedResponseWithCspHeaders(response) {
  const clonedResponse = new Response(response.body, response)

  clonedResponse.headers.set(
    'content-security-policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://*.githubusercontent.com; form-action 'self' ; navigate-to 'self'; connect-src 'self' https://polygon-rpc.com https://rpc.testnet.fantom.network "
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
