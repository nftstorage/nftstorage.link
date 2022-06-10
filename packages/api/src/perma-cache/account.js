/* eslint-env serviceworker, browser */
/* global Response */
import { JSONResponse } from '../utils/json-response.js'

/**
 * @typedef {import('../env').Env} Env
 */

/**
 * Handle perma-cache account get request
 *
 * @param {Request} request
 * @param {Env} env
 */
export async function permaCacheAccountGet(request, env) {
  const usedStorage = await env.db.getUsedPermaCacheStorage(
    request.auth.user.id
  )

  return new JSONResponse({
    usedStorage: usedStorage,
  })
}
