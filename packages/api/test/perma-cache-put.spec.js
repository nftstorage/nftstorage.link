import test from 'ava'

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
    method: 'PUT',
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
      method: 'PUT',
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
    'https://localhost:8787/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body)
})

test('Puts to perma cache IPFS path valid url with directory path', async (t) => {
  const { mf, user } = t.context

  const url =
    'https://localhost:8787/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path/file.txt'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body)
})

test('Puts to perma cache IPFS subdomain valid url without directory path', async (t) => {
  const { mf, user } = t.context
  const url =
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body)
})

test('Puts to perma cache IPFS subdomain valid url with directory path', async (t) => {
  const { mf, user } = t.context
  const url =
    'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.localhost:8787/path/file.txt'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)

  const body = await response.json()
  await validateSuccessfulPut(t, url, body)
})

test('Fails to put to perma cache ipfs path with invalid cid', async (t) => {
  const { mf, user } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl('https://localhost:8787/ipfs/invalidcid'),
    {
      method: 'PUT',
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

const validateSuccessfulPut = async (t, url, body) => {
  const { mf, user } = t.context

  console.log('b', body)

  // Validate expected body
  const { normalizedUrl, sourceUrl } = getParsedUrl(url)
  t.is(body.normalizedUrl, normalizedUrl)
  t.is(body.sourceUrl, sourceUrl)
  t.truthy(body.insertedAt)
  t.falsy(body.deletedAt)
  // t.truthy(body.contentLength) // TODO: still 0

  // Validate KV
  const ns = await mf.getKVNamespace('PERMACACHE')
  const value = await ns.get(`${user.userId}/${normalizedUrl}`)
  t.truthy(value)
  t.deepEqual(body, JSON.parse(value))

  // Validate R2
  // TODO TODO TODO TODO TODO TODO
}

const getPermaCachePutUrl = (url) =>
  `https://localhost:8787/perma-cache/${encodeURIComponent(url)}`

const getParsedUrl = (url) => {
  let normalizedUrl = new URL(url)
  // Verify if IPFS path resolution URL
  const ipfsPathParts = url.split('/ipfs/')
  if (ipfsPathParts.length > 1) {
    const pathParts = ipfsPathParts[1].split(/\/(.*)/s)
    const cid = normalizeCid(pathParts[0])
    const path = pathParts[1] ? `/${pathParts[1]}` : ''
    // TODO: handle query params
    normalizedUrl = new URL(`https://${cid}.${globals.GATEWAY_DOMAIN}${path}`)
  }

  return {
    normalizedUrl: normalizedUrl.toString(),
    sourceUrl: new URL(url).toString(),
  }
}
