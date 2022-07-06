/* eslint-env serviceworker, browser */
/* global Response */

import { JSONResponse } from '../utils/json-response.js'

/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Handle perma-cache list get request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheListGet(request, env) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const { size, page, sort, order } = parseSearchParams(searchParams)

  const entries = await env.db.listPermaCache(request.auth.user.id, {
    size,
    page,
    sort,
    order,
  })

  // Get next page link
  const headers =
    entries.length === size
      ? {
          Link: `<${requestUrl.pathname}?size=${size}&page=${
            page + 1
          }>; rel="next"`,
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
  let page = 0
  if (searchParams.has('page')) {
    const parsedPage = parseInt(searchParams.get('page'))
    if (isNaN(parsedPage) || parsedPage <= 0) {
      throw Object.assign(new Error('invalid page number'), { status: 400 })
    }
    page = parsedPage
  }

  // Parse sort parameter
  let sort = 'date'
  if (searchParams.has('sort')) {
    const parsedSort = searchParams.get('sort')
    if (parsedSort !== 'date' && parsedSort !== 'size') {
      throw Object.assign(
        new Error('invalid list sort, either "date" or "size"'),
        { status: 400 }
      )
    }
    sort = parsedSort
  }

  // Parse order parameter
  let order = 'asc'
  if (searchParams.has('order')) {
    const parsedOrder = searchParams.get('order')
    if (parsedOrder !== 'asc' && parsedOrder !== 'desc') {
      throw Object.assign(
        new Error('invalid list sort order, either "asc" or "desc"'),
        { status: 400 }
      )
    }
    sort = parsedOrder
  }

  return {
    size,
    page,
    sort,
    order,
  }
}
