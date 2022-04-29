import test from 'ava'

import { encodeKey } from '../src/perma-cache/utils.js'
import { normalizeCid } from '../src/utils/cid.js'
import { getMiniflare } from './scripts/utils.js'
import { createTestUser } from './scripts/helpers.js'
import { globals } from './scripts/worker-globals.js'

test.before(async (t) => {
  const user = await createTestUser({
    grantRequiredTags: true,
  })

  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
    user,
  }
})

// PUT /perma-cache
test('Fails when invalid url is provided', async (t) => {
  const { mf, user } = t.context

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  const body = await response.json()
  t.is(response.status, 400)

  t.is(body, 'invalid URL provided: test.png: Invalid URL')
})

test('Fails when non nftstorage.link url is provided', async (t) => {
  const { mf, user } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl('https://example.com/test.png'),
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(response.status, 400)

  const body = await response.json()
  t.is(
    body,
    'invalid URL provided: https://example.com/test.png: not nftstorage.link URL'
  )
})

test('Puts to perma cache IPFS path valid url without directory path', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
  const gatewayTxtResponse = 'Hello nft.storage! 😎'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body, gatewayTxtResponse)
})

test('Puts to perma cache IPFS path valid url with directory path', async (t) => {
  const { mf, user } = t.context

  const url =
    'http://localhost:9081/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path'
  const gatewayTxtResponse = 'Hello gateway.nft.storage resource!'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body, gatewayTxtResponse)
})

test('Puts to perma cache IPFS subdomain valid url without directory path', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081'
  const gatewayTxtResponse = 'Hello nft.storage! 😎'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body, gatewayTxtResponse)
})

test('Puts to perma cache IPFS subdomain valid url with directory path', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.localhost:9081/path'
  const gatewayTxtResponse = 'Hello gateway.nft.storage resource!'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body, gatewayTxtResponse)
})

test('Puts to perma cache IPFS subdomain valid url with query parameters', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081?download=true'
  const gatewayTxtResponse = 'Hello nft.storage! 😎'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body, gatewayTxtResponse)
})

test('Fails to put to perma cache ipfs path with invalid cid', async (t) => {
  const { mf, user } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl('http://localhost:9081/ipfs/invalidcid'),
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(response.status, 400)
  const body = await response.json()
  t.is(
    body,
    'invalid CID: invalidcid: To parse non base32 or base58btc encoded CID multibase decoder must be provided'
  )
})

test('Fails when it was already perma cached', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'

  const response1 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response1.status, 200)

  const response2 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response2.status, 400)
  const body = await response2.json()
  t.is(body, 'The provided URL was already perma cached')
})

const validateSuccessfulPut = async (t, url, body, responseTxt) => {
  const { mf, user } = t.context

  // Validate expected body
  const { normalizedUrl, sourceUrl } = getParsedUrl(url)
  t.is(body.normalizedUrl, normalizedUrl)
  t.is(body.sourceUrl, sourceUrl)
  t.truthy(body.date)
  t.falsy(body.deletedAt)
  t.truthy(body.contentLength)

  // Validate KV
  const kvKey = encodeKey({
    userId: user.userId,
    r2Key: normalizedUrl,
    date: body.date,
  })
  console.log('kvKey', kvKey)
  const ns = await mf.getKVNamespace('PERMACACHE')
  const { value, metadata } = await ns.getWithMetadata(kvKey)
  t.truthy(value)
  t.truthy(metadata)
  t.is(body.sourceUrl, metadata.sourceUrl)
  t.is(body.contentLength, metadata.contentLength)
  t.is(body.date, metadata.date)

  const nsHistory = await mf.getKVNamespace('PERMACACHE_HISTORY')
  const { value: valueHistory, metadata: metadataHistory } =
    await nsHistory.getWithMetadata(kvKey)
  t.truthy(valueHistory)
  t.truthy(metadataHistory)
  t.is(metadataHistory.operation, 'put')

  // Validate R2
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT

  const r2Response = await r2Bucket.get(normalizedUrl)
  t.deepEqual(await r2Response.text(), responseTxt)
}

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`

const getParsedUrl = (url) => {
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
