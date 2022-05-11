/* eslint-env serviceworker, browser */
/* global Response */

import { JSONResponse } from '../utils/json-response.js'
import { decodeKey } from './utils.js'

/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Handle perma-cache put request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheListGet(request, env) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const { limit } = parseSearchParams(searchParams)

  // Get user perma-cache entries by requested size recursively until requested limit or complete
  const kvPrefix = `${request.auth.user.id}`

  const {
    keys,
    cursor,
    list_complete: listComplete,
  } = await env.PERMACACHE.list({
    prefix: kvPrefix,
    limit: limit,
    cursor: searchParams.get('cursor') || undefined,
  })

  const entries = keys.map((key) => {
    const { date, r2Key } = decodeKey(key.name)

    return {
      sourceUrl: key.metadata.sourceUrl,
      normalizedUrl: r2Key,
      size: key.metadata.size,
      date,
    }
  })

  // Get next page link
  const headers =
    entries.length === limit && cursor && !listComplete
      ? {
          Link: `<${requestUrl.pathname}?size=${limit}&cursor=${cursor}>; rel="next"`,
        }
      : undefined
  return new JSONResponse(entries, { headers })
}

/**
 * @param {URLSearchParams} searchParams
 */
function parseSearchParams(searchParams) {
  // Parse size parameter
  let limit = 25
  if (searchParams.has('size')) {
    const parsedSize = parseInt(searchParams.get('size'))
    if (isNaN(parsedSize) || parsedSize <= 0 || parsedSize > 1000) {
      throw Object.assign(new Error('invalid page size'), { status: 400 })
    }
    limit = parsedSize
  }

  return {
    limit,
  }
}
