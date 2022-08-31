import { InvalidUrlError } from './errors.js'

const DNS_LABEL_MAX_LENGTH = 63 // Label's max length in DNS (https://tools.ietf.org/html/rfc1034#page-7)

/**
 * Handle IPNS path request
 *
 * @param {Request} request
 * @param {import('./env').Env} env
 */
export async function ipnsGet(request, env) {
  // @ts-ignore params in CF request
  const name = request.params.name
  const reqUrl = new URL(request.url)
  const reqQueryString = reqUrl.searchParams.toString()

  // Get pathname to query from URL pathname avoiding potential name appear in the domain
  const redirectPath = reqUrl.pathname.split(name).slice(1).join(name)
  const redirectQueryString = reqQueryString ? `?${reqQueryString}` : ''
  const dnsLabel = toDNSLinkDNSLabel(name)

  const url = new URL(
    `https://${dnsLabel}.${env.IPNS_GATEWAY_HOSTNAME}${redirectPath}${redirectQueryString}`
  )

  return Response.redirect(url.toString(), 302)
}

/**
 * Converts a FQDN to DNS-safe representation that fits in 63 characters.
 * Example: my.v-long.example.com → my-v--long-example-com
 * @param {string} fqdn
 */
function toDNSLinkDNSLabel(fqdn) {
  const dnsLabel = fqdn.replaceAll('-', '--').replaceAll('.', '-')

  if (dnsLabel.length > DNS_LABEL_MAX_LENGTH) {
    throw new InvalidUrlError(
      `invalid FQDN: ${fqdn}: longer than max length: ${DNS_LABEL_MAX_LENGTH}`
    )
  }

  return dnsLabel
}
