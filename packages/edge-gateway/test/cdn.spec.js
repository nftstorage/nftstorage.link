import test from 'ava'
import { getMiniflare } from './utils.js'
import { fromString } from 'uint8arrays'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

// Miniflare cache sometimes is not yet setup...
test.skip('Caches content on resolve', async (t) => {
  const url =
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787/'
  const content = 'Hello nft.storage! 😎'
  const { mf } = t.context

  const caches = await mf.getCaches()

  const response = await mf.dispatchFetch(url)
  await response.waitUntil()
  t.is(await response.text(), content)

  const cachedRes = await caches.default.match(url)
  t.is(await cachedRes.text(), content)
})

test('Get content from Perma cache if existing', async (t) => {
  // Should go through Perma cache bucket
  t.plan(2)

  const { mf } = t.context
  const url =
    'https://bafybeic2hr75ukgwhnasdl3sucxyfedfyp3dijq3oakzx6o23urcs4eige.ipfs.localhost:8787/'

  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const wrappedBucket = Object.assign(
    { ...r2Bucket },
    {
      get: async (key) => {
        const r2Object = await r2Bucket.get(key)
        t.truthy(r2Object)

        return r2Object
      },
    }
  )
  await mf.setOptions({
    bindings: { SUPERHOT: wrappedBucket },
  })

  const content = 'Hello perma cache!'
  await r2Bucket.put(url, new Response(fromString(content)).body)

  const response = await mf.dispatchFetch(url)
  await response.waitUntil()
  t.is(await response.text(), content)
})

test('Fail to resolve when only-if-cached and content is not cached', async (t) => {
  const url =
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787/'
  const { mf } = t.context

  const response = await mf.dispatchFetch(url, {
    headers: { 'Cache-Control': 'only-if-cached' },
  })
  await response.waitUntil()
  t.is(response.ok, false)
  t.is(response.status, 408)
})

test('Get content from cache when existing and only-if-cached cache control is provided', async (t) => {
  const { mf } = t.context
  const url =
    'https://bafybeic2hr75ukgwhnasdl3sucxyfedfyp3dijq3oakzx6o23urcs4eige.ipfs.localhost:8787/'

  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT

  const content = 'Hello perma cache!'
  await r2Bucket.put(url, new Response(fromString(content)).body)

  const response = await mf.dispatchFetch(url, {
    headers: { 'Cache-Control': 'only-if-cached' },
  })
  await response.waitUntil()
  t.is(await response.text(), content)
})

test('Should not get from cache if no-cache cache control header is provided', async (t) => {
  const url =
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787/'
  const content = 'Hello nft.storage! 😎'
  const { mf } = t.context

  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const wrappedBucket = Object.assign(
    { ...r2Bucket },
    {
      get: async (key) => {
        throw new Error('should not get from cache')
      },
    }
  )
  await mf.setOptions({
    bindings: { SUPERHOT: wrappedBucket },
  })
  // Add to cache
  await r2Bucket.put(url, new Response(fromString(content)).body)

  const response = await mf.dispatchFetch(url, {
    headers: { 'Cache-Control': 'no-cache' },
  })
  await response.waitUntil()
  t.is(await response.text(), content)
})
