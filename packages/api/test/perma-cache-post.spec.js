import test from 'ava'
import pSettle from 'p-settle'

import { getMiniflare } from './scripts/utils.js'
import { createTestUser, dbClient } from './scripts/helpers.js'
import { getParsedUrl, getPermaCachePutUrl } from './utils.js'

test.beforeEach(async (t) => {
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

test('Fails when non localhost:9081 or localhost:9082 url is provided', async (t) => {
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
    'invalid URL provided: https://example.com/test.png: not localhost:9081 or localhost:9082 URL'
  )
})

test('Puts to perma-cache IPFS path valid url without directory path', async (t) => {
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

test('Puts to perma-cache IPFS path valid url with directory path', async (t) => {
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

test('Puts to perma-cache IPFS subdomain valid url without directory path', async (t) => {
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

test('Puts to perma-cache IPFS subdomain valid url with directory path', async (t) => {
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

test('Puts to perma-cache IPFS subdomain valid url with query parameters', async (t) => {
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

test('Fails to put to perma-cache ipfs path with invalid cid', async (t) => {
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

test('Fails when it was already perma-cached', async (t) => {
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
  t.is(body, 'The provided URL was already perma-cached')
})

test('Fails on concurrent perma-cache attempt of same URL', async (t) => {
  const { mf, user } = t.context
  const urls = [
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq',
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq',
  ]

  const promises = await pSettle(
    urls.map(async (url) => {
      const putResponse = await mf.dispatchFetch(getPermaCachePutUrl(url), {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      return putResponse
    })
  )

  // Exists success response
  t.truthy(promises.find((p) => p?.value.status === 200))
  // Exists conflict response
  t.truthy(promises.find((p) => p?.value.status === 409))
})

const validateSuccessfulPut = async (t, url, body, responseTxt) => {
  const { mf, user } = t.context

  // Validate expected body
  const { normalizedUrl, sourceUrl } = getParsedUrl(url)
  t.is(body.url, sourceUrl)
  t.truthy(body.insertedAt)
  t.truthy(body.size)

  // Validate DB
  const permaCache = await dbClient.getPermaCache(user.userId, normalizedUrl)
  t.is(body.url, permaCache.url)
  t.is(body.size, permaCache.size)

  // Validate R2
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT

  const r2Response = await r2Bucket.get(normalizedUrl)
  t.deepEqual(await r2Response.text(), responseTxt)
}
