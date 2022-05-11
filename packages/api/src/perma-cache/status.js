/* eslint-env serviceworker, browser */
/* global Response */
import { HTTPError } from '../errors.js'
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
  const kvPrefix = `${request.auth.user.id}`
  let usedStorage = 0
  let endCursor

  // Iterate KV user prefix and get all the content
  do {
    const {
      keys,
      cursor,
      list_complete: listComplete,
    } = await env.PERMACACHE.list({
      prefix: kvPrefix,
      limit: 1000,
      cursor: endCursor,
    })

    if (!keys) {
      throw new HTTPError('No perma cached content found for given user')
    }

    keys.forEach((key) => {
      usedStorage += key.metadata.size
    })

    endCursor = cursor

    // Stop looking if no other entries available
    if (listComplete) {
      endCursor = undefined
    }
  } while (endCursor)

  return new JSONResponse({
    usedStorage,
  })
}
