export default {
  async fetch(request) {
    const reqUrl = new URL(request.url)
    // We need to perform requests as path based per localhost subdomain resolution
    const subdomainCid = getCidFromSubdomainUrl(reqUrl)
    if (subdomainCid) {
      return await fetch(
        new URL(
          `/ipfs/${subdomainCid}${reqUrl.pathname}`,
          'http://127.0.0.1:9081'
        )
      )
    }

    return await fetch(request.url.replace('localhost', '127.0.0.1'))
  },
}

/**
 * Parse subdomain URL and return cid
 *
 * @param {URL} url
 */
function getCidFromSubdomainUrl(url) {
  // Replace "ipfs-staging" by "ipfs" if needed
  const splitHost = url.hostname.split('.ipfs.')

  if (!splitHost.length) {
    return undefined
  }

  return splitHost[0]
}
