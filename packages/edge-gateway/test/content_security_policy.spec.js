import { test, getMiniflare } from './utils/setup.js'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Gets content from binding', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787'
  )
  await response.waitUntil()
  t.is(await response.text(), 'Hello nftstorage.link! 😎')
})
