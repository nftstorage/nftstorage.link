import { Multibases } from 'ipfs-core-utils/multibases'
import { bases } from 'multiformats/basics'
import { CID } from 'multiformats/cid'

import { InvalidUrlError } from '../errors.js'

/**
 * Parse subdomain URL and return cid
 *
 * @param {URL} url
 */
export async function getCidFromSubdomainUrl(url) {
  // Replace "ipfs-staging" by "ipfs" if needed
  const host = url.hostname.replace('ipfs-staging', 'ipfs')
  const splitHost = host.split('.ipfs.')

  if (!splitHost.length) {
    throw new InvalidUrlError(url.hostname)
  }

  let cid
  try {
    cid = await normalizeCidV1(splitHost[0])
  } catch (err) {
    throw new InvalidUrlError(`invalid CID: ${splitHost[0]}: ${err.message}`)
  }

  return cid
}

/**
 * Parse CID and return normalized b32 v1
 *
 * @param {string} cid
 */
export function normalizeCid(cid) {
  const c = CID.parse(cid)
  return c.toV1().toString()
}

/**
 * Parse CID v1 and return normalized b32 v1
 *
 * @param {string} cid
 */
async function normalizeCidV1(cid) {
  const baseDecoder = await getMultibaseDecoder(cid)
  const c = CID.parse(cid, baseDecoder)
  return c.toV1().toString()
}

/**
 * Get multibase to decode CID
 *
 * @param {string} cid
 */
async function getMultibaseDecoder(cid) {
  /** @type {MultibaseCodec[]} */
  const multibaseCodecs = Object.values(bases)
  const basicBases = new Multibases({
    bases: multibaseCodecs,
  })

  const multibasePrefix = cid[0]
  const base = await basicBases.getBase(multibasePrefix)

  return base.decoder
}
