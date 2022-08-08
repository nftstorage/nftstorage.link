/* eslint-env serviceworker */

import { Router } from 'itty-router'

import { ipfsGet } from './ipfs.js'
import { ipnsGet } from './ipns.js'
import { gatewayGet } from './gateway.js'
import { versionGet } from './version.js'

import { addCorsHeaders, withCorsHeaders } from './cors.js'
import { errorHandler } from './error-handler.js'
import { envAll } from './env.js'

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
/** @typedef {ExecutionContext} Ctx */

const router = Router()

router
  .all('*', envAll)
  .get('/version', withCorsHeaders(versionGet))
  .get('/ipfs/:cid', withCorsHeaders(ipfsGet))
  .get('/ipfs/:cid/*', withCorsHeaders(ipfsGet))
  .head('/ipfs/:cid', withCorsHeaders(ipfsGet))
  .head('/ipfs/:cid/*', withCorsHeaders(ipfsGet))
  .get('/ipns/:name', withCorsHeaders(ipnsGet))
  .get('/ipns/:name/*', withCorsHeaders(ipnsGet))
  .get('*', withCorsHeaders(gatewayGet))
  .head('*', withCorsHeaders(gatewayGet))

/**
 * @param {Error} error
 * @param {Request} request
 * @param {import('./env').Env} env
 */
function serverError(error, request, env) {
  return addCorsHeaders(request, errorHandler(error, env))
}

export default {
  /**
   *
   * @param {Request} request
   * @param {import("./bindings").Env} env
   * @param {Ctx} ctx
   */
  async fetch(request, env, ctx) {
    try {
      const res = await router.handle(request, env, ctx)
      env.log.timeEnd('request')
      return env.log.end(res)
    } catch (/** @type {any} */ error) {
      if (env.log) {
        env.log.timeEnd('request')
        return env.log.end(serverError(error, request, env))
      }
      return serverError(error, request, env)
    }
  },
}
