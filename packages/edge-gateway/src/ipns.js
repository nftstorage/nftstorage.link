import { DNS_LABEL_MAX_LENGTH } from './constants.js'
import { InvalidUrlError } from './errors.js'

/**
 * Handle IPNS path request
 *
 * @param {Request} request
 * @param {import('./env').Env} env
 */
export async function ipnsGet(request, env) {
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

  return Response.redirect(url, 302)
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
