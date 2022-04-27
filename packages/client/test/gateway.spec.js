/** eslint-env mocha */
import assert from 'assert'
import { getGatewayURL, GatewayStatusChecker } from '../src/lib.js'

/**
 * @param {getGatewayURL} fn
 * @param {() => ({ status: string })} getStatus
 */
const withStatus = (fn, getStatus) => {
  const fetch = () => ({ json: getStatus })
  // @ts-ignore fetch is a mock in tests
  const statusChecker = new GatewayStatusChecker({ fetch })
  return (/** @type {string|URL} */ cid, options = {}) =>
    fn(cid, { ...options, statusChecker })
}

/**
 * @param {getGatewayURL} fn
 * @param {string} status
 */
const withStatusValue = (fn, status) => withStatus(fn, () => ({ status }))

describe('getGatewayURL', () => {
  it('should get gateway URL for CID', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
  })

  it('should get gateway URL for CID (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
  })

  it('should get gateway URL for ipfs:// string URL', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'ipfs://bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
  })

  it('should get gateway URL for ipfs:// string URL (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'ipfs://bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
  })

  it('should get gateway URL for path based gateway string URL', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'https://ipfs.io/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
  })

  it('should get gateway URL for subdomain based gateway string URL', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'https://bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye.ipfs.dweb.link'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
  })

  it('should get gateway URL for gateway URL', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      new URL(
        'https://ipfs.io/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
      )
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
  })

  it('should get gateway URL for path based gateway string URL (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'https://ipfs.io/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
  })

  it('should get gateway URL for subdomain based gateway string URL (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      'https://bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye.ipfs.dweb.link/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
  })

  it('should get gateway URL for IPFS path', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      '/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye'
    )
  })

  it('should get gateway URL for IPFS path (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      '/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
    )
  })

  it('should get gateway URL for IPNS path', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      '/ipns/k51qzi5uqu5dlcuzv5xhg1zqn48gobcvn2mx13uoig7zfj8rz6zvqdxsugka9z'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipns/k51qzi5uqu5dlcuzv5xhg1zqn48gobcvn2mx13uoig7zfj8rz6zvqdxsugka9z'
    )
  })

  it('should get gateway URL for IPNS path (with path component)', async () => {
    const getURL = withStatusValue(getGatewayURL, 'ok')
    const url = await getURL(
      '/ipns/k51qzi5uqu5dlcuzv5xhg1zqn48gobcvn2mx13uoig7zfj8rz6zvqdxsugka9z/metadata.json'
    )
    assert.equal(
      url.toString(),
      'https://nftstorage.link/ipns/k51qzi5uqu5dlcuzv5xhg1zqn48gobcvn2mx13uoig7zfj8rz6zvqdxsugka9z/metadata.json'
    )
  })

  it('should get fallback gateway URL for non-ok status', async () => {
    const getURL = withStatusValue(getGatewayURL, 'blocked')
    const url = await getURL(
      'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
    assert.equal(
      url.toString(),
      'https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
  })

  it('should get fallback gateway URL on request error', async () => {
    const getURL = withStatus(getGatewayURL, () => {
      throw new Error('boom')
    })
    const url = await getURL(
      'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
    assert.equal(
      url.toString(),
      'https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
    )
  })

  it('should preserve query and hash', async () => {
    const getURL = withStatus(getGatewayURL, () => {
      throw new Error('boom')
    })
    const url = await getURL(
      'https://ipfs.io/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui?query#hash'
    )
    assert.equal(
      url.toString(),
      'https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui?query#hash'
    )
  })
})

describe('StatusChecker', () => {
  it('should re-request status when expired', async () => {
    const maxAge = 1000
    let callCount = 0
    const fetch = () => {
      callCount++
      return { json: () => ({ status: 'ok' }) }
    }
    const sleep = (/** @type {number} */ ms) =>
      new Promise((resolve) => setTimeout(resolve, ms))
    // @ts-ignore fetch is a mock in tests
    const statusChecker = new GatewayStatusChecker({ fetch, maxAge })
    await statusChecker.ok()
    assert.equal(callCount, 1)
    await sleep(maxAge / 2)
    await statusChecker.ok()
    assert.equal(callCount, 1)
    await sleep(maxAge)
    await statusChecker.ok()
    assert.equal(callCount, 2)
    await statusChecker.ok()
    assert.equal(callCount, 2)
  })
})
