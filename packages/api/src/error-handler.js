import { JSONResponse } from './utils/json-response.js'

/**
 * @param {Error & {status?: number;code?: string; contentType?: string;}} err
 * @param {import('./env').Env} env
 */
export function errorHandler(err, env) {
  console.error(err.stack)

  const status = err.status || 500

  if (env.sentry && status >= 500 && err.name !== 'HTTPError') {
    env.log.error(err)
  }

  return new JSONResponse(err.message || 'Server Error', { status })
}
