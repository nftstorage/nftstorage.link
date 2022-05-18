/* eslint-env serviceworker, browser */

import { encodeKeyPrefix, getSourceUrl, getNormalizedUrl } from './utils.js'
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

  const { deletedAt, hasMoreReferences } = await env.db.deletePermaCache(
    request.auth.user.id,
    normalizedUrl.toString()
  )

  // Verify if should delete from R2 if has no more references
  // and URL is not locked (on going POST)
  if (!hasMoreReferences) {
    const kvKey = encodeKeyPrefix(r2Key)
    const { keys } = await env.PERMACACHE_LOCK.list({
      prefix: kvKey,
    })

    if (!keys.length) {
      await env.SUPERHOT.delete(r2Key)
    }
  }

  return new JSONResponse(Boolean(deletedAt))
}
