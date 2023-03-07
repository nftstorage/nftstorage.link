const IPFS_GATEWAY_REDIRECT_HOSTNAME = 'dweb.link'

export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    const reqUrl = new URL(request.url)
    // We need to perform requests as path based per localhost subdomain resolution
    const subdomainCid = getCidFromSubdomainUrl(reqUrl)

    if (subdomainCid === 'bafybeiet3ym4yxqaqxbrhyvhaddi7wrglpkwoqjg5vwlsifv6duruw4vz4') {
      return Response.redirect(
        request.url.replace('localhost:8787', IPFS_GATEWAY_REDIRECT_HOSTNAME),
        307
      )
    }
    else if (subdomainCid) {
      const headers = new Headers({
        etag: subdomainCid,
      })
      return new Response('Hello nftstorage.link! 😎', {
        headers,
        status: 200,
      })
    }

    throw new Error('no cid in request')
  },
}

/**
 * Parse subdomain URL and return cid
 *
 * @param {URL} url
 */
function getCidFromSubdomainUrl(url) {
  const splitHost = url.hostname.split('.ipfs.')

  if (!splitHost.length) {
    return undefined
  }

  return splitHost[0]
}
