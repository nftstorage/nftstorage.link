/* eslint-env serviceworker, browser */

import { CID } from 'multiformats/cid'
import { InvalidUrlError } from './errors.js'

/**
 * Handle gateway request
 *
 * @param {Request} request
 * @param {import('./env').Env} env
 */
export async function ipfsGet(request, env) {
  // @ts-ignore params in CF request
  const cid = request.params.cid
  const reqUrl = new URL(request.url)
  const reqQueryString = reqUrl.searchParams.toString()

  // Get pathname to query from URL pathname avoiding potential CID appear in the domain
  const redirectPath = reqUrl.pathname.split(cid).slice(1).join(cid)
  const redirectQueryString = reqQueryString ? `?${reqQueryString}` : ''

  // Parse and normalize CID
  let nCid
  try {
    nCid = normalizeCid(cid)
  } catch (/** @type {any} */ err) {
    throw new InvalidUrlError(`invalid CID: ${cid}: ${err.message}`)
  }
  const url = new URL(
    `https://${nCid}.${env.IPFS_GATEWAY_HOSTNAME}${redirectPath}${redirectQueryString}`
  )

  return Response.redirect(url.toString(), 302)
}

/**
 * @param {string} cid
 * @returns
 */
function normalizeCid(cid) {
  const c = CID.parse(cid)
  return c.toV1().toString()
}
