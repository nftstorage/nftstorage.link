/* eslint-env serviceworker, browser */
/* global Response */
import { JSONResponse } from '../utils/json-response.js'

/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Handle perma-cache status get request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheStatusGet(request, env) {
  const usedStorage = await env.db.getUsedPermaCacheStorage(
    request.auth.user.id
  )

  return new JSONResponse({
    usedStorage: usedStorage || 0,
  })
}
