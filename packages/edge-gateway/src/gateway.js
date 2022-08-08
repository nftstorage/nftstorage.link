/* eslint-env serviceworker, browser */

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

  return getTransformedResponseWithCustomHeaders(response)
}

/**
 * Transforms response with custom headers.
 * Content-Security-Policy header specified to only allow requests within same origin.
 *
 * @param {Response} response
 */
function getTransformedResponseWithCustomHeaders(response) {
  const clonedResponse = new Response(response.body, response)

  clonedResponse.headers.set(
    'content-security-policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://*.githubusercontent.com; form-action 'self' ; navigate-to 'self'; connect-src 'self' https://polygon-rpc.com https://rpc.testnet.fantom.network "
  )

  return clonedResponse
}
