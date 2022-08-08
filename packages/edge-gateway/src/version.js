import { JSONResponse } from '@web3-storage/worker-utils/response'

/**
 * Get Gateway API version information.
 *
 * @param {Request} request
 * @param {import('./env').Env} env
 */
export async function versionGet(request, env) {
  return new JSONResponse({
    version: env.VERSION,
    commit: env.COMMITHASH,
    branch: env.BRANCH,
  })
}
