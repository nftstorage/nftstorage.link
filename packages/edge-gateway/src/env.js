/* global BRANCH, VERSION, COMMITHASH, SENTRY_RELEASE */

import Toucan from 'toucan-js'
import pkg from '../package.json'

/**
 * @typedef {import('./bindings').Env} Env
 * @typedef {import('.').Ctx} Ctx
 */

/**
 * @param {Request} request
 * @param {Env} env
 * @param {import('.').Ctx} ctx
 */
export function envAll(request, env, ctx) {
  env.IPFS_GATEWAY_HOSTNAME = env.GATEWAY_HOSTNAME
  env.IPNS_GATEWAY_HOSTNAME = env.GATEWAY_HOSTNAME.replace('ipfs', 'ipns')

  // These values are replaced at build time by esbuild `define`
  env.BRANCH = BRANCH
  env.VERSION = VERSION
  env.COMMITHASH = COMMITHASH
  env.SENTRY_RELEASE = SENTRY_RELEASE

  env.sentry = getSentry(request, env, ctx)
}

/**
 * Get sentry instance if configured
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('.').Ctx} ctx
 */
function getSentry(request, env, ctx) {
  if (!env.SENTRY_DSN) {
    return
  }

  return new Toucan({
    request,
    dsn: env.SENTRY_DSN,
    context: ctx,
    allowedHeaders: ['user-agent'],
    allowedSearchParams: /(.*)/,
    debug: false,
    environment: env.ENV || 'dev',
    rewriteFrames: {
      // sourcemaps only work if stack filepath are absolute like `/worker.js`
      root: '/',
    },
    release: env.SENTRY_RELEASE,
    pkg,
  })
}
