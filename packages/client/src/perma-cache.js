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
 * const client = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })
 * const permaCacheEntries = await client.put(urls)
 * await client.delete(urls)
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
const ABORTABLE_ERRORS_STATUS = [
  400, // Invalid URL
  401, // Not authenticated
  403, // Not authorized
  417, // Expectation Failed Error
]

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
   * const client = new PermaCache({ token: API_TOKEN })
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
    { onPut, maxRetries = MAX_RETRIES } = {}
  ) {
    areNftStorageLinkUrls(urls)

    const headers = PermaCache.headers(token)

    /** @type {import('p-settle').PromiseResult<CacheResult>[]} */
    const cacheResults = await pSettle(
      urls.map(async (url) => {
        const apiUrl = new URL(
          `perma-cache/${encodeURIComponent(url)}`,
          endpoint
        )

        let cacheResult
        try {
          cacheResult = await pRetry(
            async () => {
              await rateLimiter()
              const request = await fetch(apiUrl.toString(), {
                method: 'POST',
                headers,
              })

              /** @type {CacheResult} */
              const res = await request.json()
              if (!request.ok) {
                // @ts-ignore Only exists on Error
                const e = new Error(res.message)
                // do not retry if abortable errors - will not succeed
                if (ABORTABLE_ERRORS_STATUS.includes(request.status)) {
                  throw new AbortError(e)
                }
                /* c8 ignore next 2 */
                throw e
              }

              onPut && onPut(url)

              return {
                ...res,
                url, // decoded
              }
            },
            /* c8 ignore next 3 */
            {
              retries: maxRetries == null ? MAX_RETRIES : maxRetries,
            }
          )
        } catch (error) {
          return {
            // @ts-ignore non error type
            error: error.message,
            url,
          }
        }
        return cacheResult
      })
    )

    // @ts-ignore p-settle will always handle error internally
    return cacheResults.map((cacheResult) => cacheResult.value)
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
    do {
      await rateLimiter()

      const request = await fetch(nextPageUrl.toString(), {
        method: 'GET',
        headers,
      })
      const result = await request.json()
      if (!request.ok) {
        throw new Error(result.message)
      }

      // Go over next links until not provided by API anymore
      const link = request.headers.get('link')
      if (link) {
        nextPageUrl = new URL(
          link.replace('<', '').replace('>; rel="next"', ''),
          endpoint
        )
      } else {
        // @ts-ignore typescript complains about URL type cannot be undefined
        nextPageUrl = undefined
      }

      for (const entry of result) {
        yield entry
      }
    } while (nextPageUrl)
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
    { onDelete, maxRetries = MAX_RETRIES } = {}
  ) {
    areNftStorageLinkUrls(urls)

    const headers = PermaCache.headers(token)

    /** @type {import('p-settle').PromiseResult<CacheDeleteResult>[]} */
    const cacheDeleteResults = await pSettle(
      urls.map(async (url) => {
        const apiUrl = new URL(
          `perma-cache/${encodeURIComponent(url)}`,
          endpoint
        )

        try {
          return await pRetry(
            async () => {
              await rateLimiter()
              const request = await fetch(apiUrl.toString(), {
                method: 'DELETE',
                headers,
              })

              const res = await request.json()
              if (!request.ok) {
                const e = new Error(res.message)
                // do not retry if abortable errors - will not succeed
                if (ABORTABLE_ERRORS_STATUS.includes(request.status)) {
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
        } catch (error) {
          return {
            // @ts-ignore non error type
            error: error.message,
            url,
          }
        }
      })
    )

    // @ts-ignore p-settle will always handle error internally
    return cacheDeleteResults.map((cacheResult) => cacheResult.value)
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
    const request = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })
    const res = await request.json()
    if (!request.ok) {
      throw new Error(res.message)
    }

    return res
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
 * @param {string[]} urls
 */
function areNftStorageLinkUrls(urls) {
  urls.forEach((urlString) => {
    const url = new URL(urlString)

    if (
      !url.hostname.includes('.ipfs.nftstorage.link') &&
      !(
        url.hostname.includes('nftstorage.link') &&
        url.pathname.startsWith('/ipfs')
      )
    ) {
      throw new Error('One or more urls are not nftstorage.link IPFS URLs')
    }
  })
}