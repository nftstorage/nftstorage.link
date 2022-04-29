import { normalizeCid } from '../src/utils/cid.js'
import { globals } from './scripts/worker-globals.js'

export const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`

export function getParsedUrl(url) {
  let normalizedUrl = new URL(url)
  // Verify if IPFS path resolution URL
  const ipfsPathParts = normalizedUrl.pathname.split('/ipfs/')
  if (ipfsPathParts.length > 1) {
    const pathParts = ipfsPathParts[1].split(/[\/\?](.*)/s)
    const cid = normalizeCid(pathParts[0])
    // Parse path + query params
    const path = pathParts[1] ? `/${pathParts[1]}` : ''
    const queryParamsString = normalizedUrl.searchParams.toString()
    const queryParams = queryParamsString.length ? `?${queryParamsString}` : ''

    normalizedUrl = new URL(
      `${normalizedUrl.protocol}//${cid}.ipfs.${globals.GATEWAY_DOMAIN}${path}${queryParams}`
    )
  }

  return {
    normalizedUrl: normalizedUrl.toString(),
    sourceUrl: new URL(url).toString(),
  }
}
