/* eslint-env serviceworker, browser */

// TODO: Move to separate file
import { getSourceUrl, getNormalizedUrl } from './post.js'
import { encodeKey } from './utils.js'
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

  const kvPrefix = `${request.auth.user.id}:${encodeURIComponent(r2Key)}:`
  const { keys } = await env.PERMACACHE.list({
    prefix: kvPrefix,
  })
  if (keys.length === 0) {
    return new JSONResponse(false)
  }

  // Remove entry
  await Promise.all(keys.map((key) => env.PERMACACHE.delete(key.name)))
  const date = new Date().toISOString()
  const kvKey = encodeKey({
    userId: request.auth.user.id,
    r2Key,
    date,
  })
  // Update R2 and History
  await Promise.all([
    env.PERMACACHE_HISTORY.put(kvKey, r2Key, {
      metadata: {
        contentLength: keys[0].metadata.contentLength,
        date,
        operation: 'delete',
      },
    }),
    env.SUPERHOT.delete(r2Key),
  ])

  return new JSONResponse(true)
}
