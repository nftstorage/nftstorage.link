/* eslint-env serviceworker, browser */
/* global Response */

import parseRange from 'http-range-parse'

import { getSourceUrl, getNormalizedUrl } from '../utils/url.js'
import { UrlNotFoundError, InvalidRangeError } from '../errors.js'

/**
 * @typedef {import('../env').Env} Env
 * @typedef {import('../env').R2Range} R2Range
 */

/**
 * Handle perma-cache get request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheGet(request, env) {
  const sourceUrl = getSourceUrl(request, env)
  const normalizedUrl = getNormalizedUrl(sourceUrl, env)
  const r2Key = normalizedUrl.toString()

  let r2Object, range

  try {
    range = toR2Range(request.headers.get('range'))
  } catch (error) {
    throw new InvalidRangeError(error.message)
  }

  try {
    // Get R2 response
    r2Object = await env.SUPERHOT.get(r2Key, {
      range,
    })

    if (!r2Object || !r2Object.body) {
      throw new Error()
    }
  } catch (_) {
    throw new UrlNotFoundError()
  }

  const headers = new Headers()
  headers.set('etag', r2Object.httpEtag)
  try {
    r2Object.writeHttpMetadata(headers)
  } catch (_) {}

  if (range) {
    headers.set('status', '206')
    let first, last
    if (range.suffix != null) {
      first = r2Object.size - range.suffix
      last = r2Object.size - 1
    } else {
      first = range.offset || 0
      last = range.length != null ? first + range.length - 1 : r2Object.size - 1
    }
    headers.set('content-range', `bytes ${first}-${last}/${r2Object.size}`)
    headers.set('content-length', `${last - first + 1}`)
  } else {
    headers.set('status', '200')
    headers.set('content-length', `${r2Object.size}`)
  }

  return new Response(r2Object.body, {
    status: range ? 206 : 200,
  })
}

/**
 * Convert a HTTP Range header to an R2 range object.
 *
 * @param {string|null} encoded
 * @returns {R2Range|undefined}
 */
function toR2Range(encoded) {
  if (encoded === null) {
    return
  }

  const result = parseRange(encoded)
  if (result.ranges)
    throw new InvalidRangeError('Multiple ranges not supported')
  const { unit, first, last, suffix } = result
  if (unit !== 'bytes')
    throw new InvalidRangeError(`Unsupported range unit: ${unit}`)
  return suffix != null
    ? { suffix }
    : { offset: first, length: last != null ? last - first + 1 : undefined }
}
