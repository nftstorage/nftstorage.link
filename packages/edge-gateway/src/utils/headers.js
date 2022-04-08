/**
 * @param {Request} request
 */
export function getIpfsGatewayHeaders(request) {
  const existingProxies = request.headers.get('X-Forwarded-For')
    ? `, ${request.headers.get('X-Forwarded-For')}`
    : ''
  return {
    'X-Forwarded-For': `${request.headers.get(
      'cf-connecting-ip'
    )}${existingProxies}`,
    'X-Forwarded-Host': request.headers.get('host'),
  }
}
