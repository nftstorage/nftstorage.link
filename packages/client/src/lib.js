const ENDPOINT = 'https://api.nftstoragestatus.com'
const MAX_AGE = 60000
const GATEWAY_URL = 'https://nftstorage.link'
const FALLBACK_GATEWAY_URL = 'https://dweb.link'

/**
 * Check the status of a gateway and cache the result for a period of time.
 */
export class StatusChecker {
  /**
   * @param {Object} [config]
   * @param {string} [config.endpoint] Gateway status API URL.
   * @param {number} [config.maxAge] Time in ms after which a status value is stale.
   * @param {globalThis.fetch} [config.fetch] Custom fetch API implementation.
   */
  constructor(config) {
    config = config || {}
    this._endpoint = config.endpoint || ENDPOINT
    this._maxAge = config.maxAge || MAX_AGE
    this._fetch = config.fetch || globalThis.fetch
    this._lastCheck = 0
    /** @type {Promise<boolean>|null} */
    this._request = null
  }

  /**
   * Determine if the status of the gateway is OK or not.
   */
  ok() {
    const now = Date.now()
    if (!this._request || now - this._lastCheck > this._maxAge) {
      this._request = (async () => {
        this._lastCheck = now
        try {
          const res = await this._fetch(this._endpoint)
          const data = await res.json()
          return data.status === 'ok'
        } catch {
          return false
        }
      })()
    }
    return this._request
  }
}

const defaultStatusChecker = new StatusChecker()

/**
 * Get a gateway URL, given a CID, CID+path, IPFS path or an IPFS gateway URL.
 * If the status of the nftstorage.link gateway is known to be good (according
 * to the status checker) then return a URL that uses nftstorage.link, otherwise
 * return an URL that uses dweb.link (or the optional passed fallback gateway
 * URL).
 *
 * @param {string|URL} cidPath
 * @param {Object} [options]
 * @param {StatusChecker} [options.statusChecker]
 * @param {string} [options.fallbackGatewayURL]
 */
export async function getGatewayURL(cidPath, options) {
  /* c8 ignore next 2 */
  options = options || {}
  const statusChecker = options.statusChecker || defaultStatusChecker
  const fallbackGatewayURL = options.fallbackGatewayURL || FALLBACK_GATEWAY_URL
  const isOk = await statusChecker.ok()
  let { protocol, hostname, pathname, search, hash } = new URL(
    cidPath,
    GATEWAY_URL
  )
  if (protocol === 'ipfs:' || protocol === 'ipns:') {
    // differences in parsing behaviour between Node.js and Chrome URL:
    // in one impl, hostname is 'bafyrei...', pathname is '/path' and in the
    // other, hostname is '', pathname is '//bafyrei.../path'.
    /* c8 ignore next 1 */
    pathname = hostname ? `/${hostname}${pathname}` : pathname.slice(1)
    pathname = `/${protocol.slice(0, -1)}${pathname}`
  } else if (!pathname.startsWith('/ipfs') && !pathname.startsWith('/ipns')) {
    const hostParts = hostname.split('.') // subdomain gateway URL?
    pathname =
      hostParts[1] === 'ipfs' || hostParts[1] === 'ipns'
        ? `/${hostParts[1]}/${hostParts[0]}${pathname === '/' ? '' : pathname}`
        : `/ipfs${pathname}`
  }
  const base = isOk ? GATEWAY_URL : fallbackGatewayURL
  return new URL(`${pathname}${search}${hash}`, base)
}
