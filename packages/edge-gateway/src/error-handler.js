/* eslint-env serviceworker, browser */

/**
 * @param {Error & {status?: number;code?: string; contentType?: string;}} err
 * @param {import('./env').Env} env
 */
export function errorHandler(err, env) {
  console.error(err.stack)

  const status = err.status || 500

  return new Response(err.message || 'Server Error', {
    status,
    headers: {
      'content-type': err.contentType || 'text/plain',
    },
  })
}
