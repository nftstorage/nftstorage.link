/* eslint-env serviceworker, browser */
/* global Response */

import { getSourceUrl, getNormalizedUrl } from '../utils/url.js'
import { UrlNotFoundError } from '../errors.js'

/**
 * @typedef {import('../env').Env} Env
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

  const r2Object = await env.SUPERHOT.get(r2Key)
  if (r2Object) {
    return new Response(r2Object.body)
  }

  throw new UrlNotFoundError()
}
