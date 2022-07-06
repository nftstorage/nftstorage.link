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

  const { mf } = t.context
  const url =
    'https://bafybeic2hr75ukgwhnasdl3sucxyfedfyp3dijq3oakzx6o24urcs4eige.ipfs.localhost:8787/'

  const content = 'Hello perma cache!'

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
    'https://bafybeic2hr75ukgwhnasdl3sucxyfedfyp3dijq3oakzx6o24urcs4eige.ipfs.localhost:8787/'
  const content = 'Hello perma cache!'

  const response = await mf.dispatchFetch(url, {
    headers: { 'Cache-Control': 'only-if-cached' },
  })
  await response.waitUntil()
  t.is(await response.text(), content)
})

test('Should not get from cache if no-cache cache control header is provided', async (t) => {
  const url =
    'https://bafybeic2hr75ukgwhnasdl3sucxyfedfyp3dijq3oakzx6o24urcs4eige.ipfs.localhost:8787/'
  const { mf } = t.context

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 2000)

  try {
    await mf.dispatchFetch(url, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    })
    throw new Error('should not resolve')
  } catch (err) {
    t.assert(err)
  } finally {
    clearTimeout(timer)
  }
})
