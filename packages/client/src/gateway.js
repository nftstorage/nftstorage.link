const API_URL = 'https://api.nftstoragestatus.com'
const MAX_AGE = 60000
const GATEWAY_URL = 'https://nftstorage.link'
const FALLBACK_GATEWAY_URL = 'https://dweb.link'

/**
 * @typedef {Object} IGatewayStatusChecker Checks the status of an IPFS gateway.
 * @property {URL} gatewayURL Base URL of the IPFS gateway status is being checked for.
 * @property {() => Promise<boolean>} ok Determines if the status of the gateway is OK or not.
 */

/**
 * Check the status of a gateway and cache the result for a period of time.
 * @implements {IGatewayStatusChecker}
 */
export class GatewayStatusChecker {
  /**
   * @param {Object} [config]
   * @param {string|URL} [config.apiURL] Gateway status API URL.
   * @param {string|URL} [config.gatewayURL] Base URL of the IPFS gateway status is being checked for.
   * @param {number} [config.maxAge] Time in ms after which a status value is stale.
   * @param {globalThis.fetch} [config.fetch] Custom fetch API implementation.
   */
  constructor(config) {
    config = config || {}
    /** @private */
    this._apiURL = config.apiURL || API_URL
    /** @private */
    this._gatewayURL = new URL(config.gatewayURL || GATEWAY_URL)
    /** @private */
    this._maxAge = config.maxAge || MAX_AGE
    /** @private */
    this._fetch = config.fetch
    /* c8 ignore next 3 */
    if (!this._fetch && globalThis.fetch) {
      this._fetch = globalThis.fetch.bind(globalThis)
    }
    /** @private */
    this._lastCheck = 0
    /**
     * @type {Promise<boolean>|null}
     * @private
     */
    this._request = null
  }

  get gatewayURL() {
    return this._gatewayURL
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
          const fetch = this._fetch
          /* c8 ignore next 1 */
          if (!fetch) throw new Error('missing fetch implementation')
          const res = await fetch(this._apiURL.toString())
          const data = await res.json()
          return data.status === 'ok'
        } catch (err) {
          console.warn('Failed to fetch gateway status:', err)
          return false
        }
      })()
    }
    return this._request
  }
}

const defaultStatusChecker = new GatewayStatusChecker()

/**
 * Get a gateway URL, given a CID, CID+path, IPFS path or an IPFS gateway URL.
 * If the status of the nftstorage.link gateway is known to be good (according
 * to the status checker) then return a URL that uses nftstorage.link, otherwise
 * return an URL that uses dweb.link (or the optional passed fallback gateway
 * URL).
 *
 * @param {string|URL} cidPath
 * @param {Object} [options]
 * @param {IGatewayStatusChecker} [options.statusChecker]
 * @param {string|URL} [options.fallbackGatewayURL]
 */
export async function getGatewayURL(cidPath, options) {
  /* c8 ignore next 2 */
  options = options || {}
  const statusChecker = options.statusChecker || defaultStatusChecker
  const fallbackGatewayURL = options.fallbackGatewayURL || FALLBACK_GATEWAY_URL
  const isOk = await statusChecker.ok()
  let { protocol, hostname, pathname, search, hash } = new URL(
    cidPath,
    statusChecker.gatewayURL
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
  const base = isOk ? statusChecker.gatewayURL : fallbackGatewayURL
  return new URL(`${pathname}${search}${hash}`, base)
}
