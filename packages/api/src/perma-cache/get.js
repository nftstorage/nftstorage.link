/* eslint-env serviceworker, browser */
/* global Response */

import { JSONResponse } from '../utils/json-response.js'

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
  const { before, size, sortBy, sortOrder } = parseSearchParams(searchParams)

  const entries = await env.db.listPermaCache(request.auth.user.id, {
    size,
    before: before.toISOString(),
    sortBy,
    sortOrder,
  })
  const oldest = entries[entries.length - 1]

  // Get next page link
  const headers =
    entries.length === size
      ? {
          Link: `<${
            requestUrl.pathname
          }?size=${size}&before=${encodeURIComponent(
            oldest.insertedAt
          )}>; rel="next"`,
        }
      : undefined
  return new JSONResponse(entries, { headers })
}

/**
 * @param {URLSearchParams} searchParams
 */
function parseSearchParams(searchParams) {
  // Parse size parameter
  let size = 25
  if (searchParams.has('size')) {
    const parsedSize = parseInt(searchParams.get('size'))
    if (isNaN(parsedSize) || parsedSize <= 0 || parsedSize > 1000) {
      throw Object.assign(new Error('invalid page size'), { status: 400 })
    }
    size = parsedSize
  }

  // Parse cursor parameter
  let before = new Date()
  if (searchParams.has('before')) {
    const parsedBefore = new Date(searchParams.get('before'))
    if (isNaN(parsedBefore.getTime())) {
      throw Object.assign(new Error('invalid before date'), { status: 400 })
    }
    before = parsedBefore
  }

  const sortBy = searchParams.get('sortBy') || 'Date'
  const sortOrder = searchParams.get('sortOrder') || 'Desc'

  return {
    before,
    size,
    sortBy,
    sortOrder,
  }
}
