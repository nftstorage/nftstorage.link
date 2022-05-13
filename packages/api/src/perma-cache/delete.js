/* eslint-env serviceworker, browser */

// TODO: Move to separate file
import { getSourceUrl, getNormalizedUrl } from './post.js'
import { JSONResponse } from '../utils/json-response.js'
/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Handle perma-cache delete request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheDelete(request, env) {
  const sourceUrl = getSourceUrl(request, env)
  const normalizedUrl = getNormalizedUrl(sourceUrl, env)
  const r2Key = normalizedUrl.toString()

  const res = await env.db.deletePermaCache(
    request.auth.user.id,
    normalizedUrl.toString()
  )
  await env.SUPERHOT.delete(r2Key)

  return new JSONResponse(Boolean(res))
}
