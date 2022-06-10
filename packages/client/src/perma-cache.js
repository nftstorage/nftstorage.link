/**
 * A client library for the https://api.nftstorage.link/ perma-cache service. It provides a convenient
 * interface for working with the [Raw HTTP API](https://nftstorage.link/#api-docs)
 * from a web browser or [Node.js](https://nodejs.org/) and comes bundled with
 * TS for out-of-the box type inference and better IntelliSense.
 *
 * @example
 * ```js
 * import { PermaCache } from 'nftstorage.link'
 *
 * const urls = [
 *  'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link'
 * ]
 *
 * const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })
 * const permaCacheEntries = await cache.put(urls)
 * await cache.delete(urls)
 * ```
 * @module
 */

import throttledQueue from 'throttled-queue'
import pSettle from 'p-settle'
import pRetry, { AbortError } from 'p-retry'

import { fetch } from './platform.js'

const MAX_RETRIES = 5
// These match what is enforced server-side
const RATE_LIMIT_REQUESTS = 100
const RATE_LIMIT_PERIOD = 60 * 1000

/**
 * @typedef { import('./lib/interface.js').RateLimiter } RateLimiter
 * @typedef { import('./lib/interface.js').Service } Service
 * @typedef { import('./lib/interface.js').PutOptions} PutOptions
 * @typedef { import('./lib/interface.js').DeleteOptions} DeleteOptions
 * @typedef { import('./lib/interface.js').ListOptions} ListOptions
 * @typedef { import('./lib/interface.js').CacheResult} CacheResult
 * @typedef { import('./lib/interface.js').CacheDeleteResult} CacheDeleteResult
 * @typedef { import('./lib/interface.js').CacheEntry} CacheEntry
 * @typedef { import('./lib/interface.js').AccountInfo} AccountInfo
 */

/**
 * @implements Service
 */
export class PermaCache {
  /**
   * Constructs a client bound to the given `options.token` and
   * `options.endpoint`.
   *
   * @example
   * ```js
   * import { PermaCache } from 'nftstorage.link'
   * const cache = new PermaCache({ token: API_TOKEN })
   * ```
   *
   * @param {{token: string, endpoint?:URL, rateLimiter?: RateLimiter}} options
   */
  constructor({
    token,
    endpoint = new URL('https://api.nftstorage.link'),
    rateLimiter,
  }) {
    /**
     * Authorization token.
     *
     * @readonly
     */
    this.token = token
    /**
     * Service API endpoint `URL`.
     * @readonly
     */
    this.endpoint = endpoint
    /**
     * @readonly
     */
    this.rateLimiter = rateLimiter || createRateLimiter()
  }

  /**
   * @hidden
   * @param {string} token
   * @returns {Record<string, string>}
   */
  static headers(token) {
    /* c8 ignore next 1 */
    if (!token) throw new Error('missing token')
    return {
      Authorization: `Bearer ${token}`,
      'X-Client': 'nftstorage.link/js',
    }
  }

  /**
   * @param {Service} service
   * @param {string[]} urls
   * @param {PutOptions} [options]
   * @returns {Promise<CacheResult[]>}
   */
  static async put(
    { endpoint, token, rateLimiter = globalRateLimiter },
    urls,
    { onPut, maxRetries } = {}
  ) {
    urls.forEach(validateUrl)

    const headers = PermaCache.headers(token)

    /** @type {import('p-settle').PromiseResult<CacheResult>[]} */
    const cacheResults = await pSettle(
      urls.map(async (url) => {
        const apiUrl = new URL(
          `perma-cache/${encodeURIComponent(url)}`,
          endpoint
        )

        return await pRetry(
          async () => {
            await rateLimiter()
            const response = await fetch(apiUrl.toString(), {
              method: 'POST',
              headers,
            })

            /** @type {CacheResult} */
            const result = await response.json()
            if (!response.ok) {
              // @ts-ignore Only exists on Error
              const e = new Error(result.message)
              // do not retry if fatal errors - will not succeed
              if (response.status >= 400 && response.status < 500) {
                throw new AbortError(e)
              }
              /* c8 ignore next 2 */
              throw e
            }
            onPut && onPut(url)

            return result
          },
          /* c8 ignore next 3 */
          {
            retries: maxRetries == null ? MAX_RETRIES : maxRetries,
          }
        )
      })
    )

    return cacheResults.map((r, i) => {
      // @ts-ignore reason and value might not exist, but one of them always exists
      return r.reason ? { url: urls[i], error: r.reason.message } : r.value
    })
  }

  /**
   * @param {Service} service
   * @param {ListOptions} [options]
   * @returns {AsyncIterable<CacheEntry>}
   */
  static async *list(
    { endpoint, token, rateLimiter = globalRateLimiter },
    { sort = 'date', order = 'asc' } = {}
  ) {
    const headers = PermaCache.headers(token)
    let search = new URLSearchParams({ sort, order })
    let nextPageUrl = new URL(`perma-cache?${search}`, endpoint)

    while (true) {
      await rateLimiter()

      const response = await fetch(nextPageUrl.toString(), {
        method: 'GET',
        headers,
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message)
      }

      for (const entry of result) {
        yield entry
      }

      // Go over next links until not provided by API anymore
      const link = response.headers.get('link')
      if (!link) {
        break
      }
      nextPageUrl = new URL(
        link.replace('<', '').replace('>; rel="next"', ''),
        endpoint
      )
    }
  }

  /**
   * @param {Service} service
   * @param {string[]} urls
   * @param {DeleteOptions} [options]
   * @returns {Promise<CacheDeleteResult[]>}
   */
  static async delete(
    { endpoint, token, rateLimiter = globalRateLimiter },
    urls,
    { onDelete, maxRetries } = {}
  ) {
    urls.forEach(validateUrl)

    const headers = PermaCache.headers(token)

    /** @type {import('p-settle').PromiseResult<CacheDeleteResult>[]} */
    const cacheDeleteResults = await pSettle(
      urls.map(async (url) => {
        const apiUrl = new URL(
          `perma-cache/${encodeURIComponent(url)}`,
          endpoint
        )

        return await pRetry(
          async () => {
            await rateLimiter()
            const response = await fetch(apiUrl.toString(), {
              method: 'DELETE',
              headers,
            })

            const result = await response.json()
            if (!response.ok) {
              const e = new Error(result.message)
              // do not retry if fatal errors - will not succeed
              if (response.status >= 400 && response.status < 500) {
                throw new AbortError(e)
              }
              /* c8 ignore next 2 */
              throw e
            }

            onDelete && onDelete(url)

            return {
              url,
            }
          },
          /* c8 ignore next 3 */
          {
            retries: maxRetries == null ? MAX_RETRIES : maxRetries,
          }
        )
      })
    )

    return cacheDeleteResults.map((r, i) => {
      // @ts-ignore reason and value might not exist, but one of them always exists
      return r.reason ? { url: urls[i], error: r.reason.message } : r.value
    })
  }

  /**
   * @param {Service} service
   * @return {Promise<AccountInfo>}
   */
  static async accountInfo({
    endpoint,
    token,
    rateLimiter = globalRateLimiter,
  }) {
    const url = new URL('perma-cache/account', endpoint)
    const headers = PermaCache.headers(token)

    await rateLimiter()
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message)
    }

    return result
  }

  // Just a sugar so you don't have to pass around endpoint and token around.

  /**
   * Perma cache URLS into nftstorage.link.
   *
   * Returns the corresponding Perma cache entries created.
   *
   * @param {string[]} urls
   * @param {PutOptions} [options]
   * @returns {Promise<CacheResult[]>}
   */
  put(urls, options) {
    return PermaCache.put(this, urls, options)
  }

  /**
   * List all Perma cached URLs for this account. Use a `for await...of` loop to fetch them all.
   * @example
   * Fetch all the urls
   * ```js
   * const urls = []
   * for await (const item of client.list()) {
   *    urls.push(item)
   * }
   * ```
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
   * @param {ListOptions} [options]
   * @returns {AsyncIterable<CacheEntry>}
   */
  list(options) {
    return PermaCache.list(this, options)
  }

  /**
   * @param {string[]} urls
   * @param {DeleteOptions} [options]
   * @returns {Promise<CacheDeleteResult[]>}
   */
  delete(urls, options) {
    return PermaCache.delete(this, urls, options)
  }

  /**
   * Fetch info on PermaCache for the user.
   */
  accountInfo() {
    return PermaCache.accountInfo(this)
  }
}

/**
 * Creates a rate limiter which limits at the same rate as is enforced
 * server-side, to allow the client to avoid exceeding the requests limit and
 * being blocked for 30 seconds.
 * @returns {RateLimiter}
 */
export function createRateLimiter() {
  const throttle = throttledQueue(RATE_LIMIT_REQUESTS, RATE_LIMIT_PERIOD)
  return () => throttle(() => {})
}

/**
 * Rate limiter used by static API if no rate limiter is passed. Note that each
 * instance of the PermaCache class gets it's own limiter if none is passed.
 * This is because rate limits are enforced per API token.
 */
const globalRateLimiter = createRateLimiter()

/**
 * @param {string} urlString
 */
function validateUrl(urlString) {
  const url = new URL(urlString)
  if (
    !url.hostname.includes('.ipfs.nftstorage.link') &&
    !(
      url.hostname.includes('nftstorage.link') &&
      url.pathname.startsWith('/ipfs')
    )
  ) {
    throw new Error(
      `Invalid URL (not an nftstorage.link IPFS URL): ${urlString}`
    )
  }
}
