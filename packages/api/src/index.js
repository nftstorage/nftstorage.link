/* eslint-env serviceworker */

import { Router } from 'itty-router'

import { withAuth } from './auth.js'
import {
  permaCachePost,
  permaCacheListGet,
  permaCacheStatusGet,
  permaCacheDelete,
} from './perma-cache/index.js'
import { metricsGet } from './metrics.js'
import { addCorsHeaders, withCorsHeaders } from './cors.js'
import { errorHandler } from './error-handler.js'
import { envAll } from './env.js'

const router = Router()

const auth = {
  '🤲': (handler) => withCorsHeaders(handler),
  '🔒': (handler) => withCorsHeaders(withAuth(handler)),
}

router
  .all('*', envAll)
  .get('/metrics', withCorsHeaders(metricsGet))
  .get('/perma-cache', auth['🔒'](permaCacheListGet))
  .post('/perma-cache/:url', auth['🔒'](permaCachePost))
  .get('/perma-cache/status', auth['🔒'](permaCacheStatusGet))
  .delete('/perma-cache/:url', auth['🔒'](permaCacheDelete))

/**
 * @param {Error} error
 * @param {Request} request
 * @param {import('./env').Env} env
 */
function serverError(error, request, env) {
  return addCorsHeaders(request, errorHandler(error, env))
}

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
/** @typedef {{ waitUntil(p: Promise): void }} Ctx */

export default {
  async fetch(request, env, ctx) {
    try {
      const res = await router.handle(request, env, ctx)
      env.log.timeEnd('request')
      return env.log.end(res)
    } catch (error) {
      if (env.log) {
        env.log.timeEnd('request')
        return env.log.end(serverError(error, request, env))
      }
      return serverError(error, request, env)
    }
  },
}
