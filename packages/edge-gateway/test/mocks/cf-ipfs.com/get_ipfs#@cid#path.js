/**
 * https://github.com/sinedied/smoke#javascript-mocks
 */
module.exports = () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
      Etag: 'bafkreia4d2wzubczuknsuwcrta2psy7rjkso4xxryjep44yvddtp6pe5vu',
    },
    body: 'Hello gateway.nft.storage resource!',
  }
}
