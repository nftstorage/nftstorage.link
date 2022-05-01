/**
 * @param {*} request
 */
module.exports = ({ headers, query }) => {
  if (!headers.authorization || headers.authorization === 'Bearer bad') {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/json' },
      body: {
        message: 'Permission denied',
      },
    }
  }

  let responseHeaders = {
    'Content-Type': 'text/json',
  }

  // Put link for next page in response headers
  if (!query.page) {
    const search = new URLSearchParams({
      ...query,
      page: 2,
    })

    responseHeaders = {
      'Content-Type': 'text/json',
      // @ts-ignore
      Link: `http://${headers.host}/perma-cache?${search}`,
    }
  }

  return {
    statusCode: 200,
    headers: responseHeaders,
    body: [
      {
        url: 'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
        size: 1000,
        insertedAt: new Date().toISOString(),
      },
      {
        url: 'https://nftstorage.link/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
        size: 2200,
        insertedAt: new Date().toISOString(),
      },
    ],
  }
}
