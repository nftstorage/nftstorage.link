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

  // CSP
  const csp = response.headers.get('content-security-policy') || ''
  t.true(csp.includes("default-src 'self' 'unsafe-inline' 'unsafe-eval'"))
  t.true(csp.includes('blob: data'))
  t.true(csp.includes("form-action 'self' ; navigate-to 'self';"))
})

test('Gets content with no csp header when goodbits csp bypass tag exists', async (t) => {
  const { mf } = t.context
  const cid = 'bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupor'

  // add the CID to the goodbits list
  const goodbitsListKv = await mf.getKVNamespace('GOODBITSLIST')
  await goodbitsListKv.put(
    cid,
    JSON.stringify({
      tags: ['https://nftstorage.link/tags/bypass-default-csp'],
    })
  )

  const response = await mf.dispatchFetch(`https://${cid}.ipfs.localhost:8787`)
  await response.waitUntil()
  t.is(await response.text(), 'Hello nftstorage.link! 😎')

  // CSP does not exist
  const csp = response.headers.get('content-security-policy')
  t.falsy(csp)
})

test('Gets content with csp header when goodbits csp bypass tag does not exist', async (t) => {
  const { mf } = t.context
  const cid = 'bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupos'

  // add the CID to the goodbits list
  const goodbitsListKv = await mf.getKVNamespace('GOODBITSLIST')
  await goodbitsListKv.put(
    cid,
    JSON.stringify({
      tags: ['foo-bar-tag'],
    })
  )

  const response = await mf.dispatchFetch(`https://${cid}.ipfs.localhost:8787`)
  await response.waitUntil()
  t.is(await response.text(), 'Hello nftstorage.link! 😎')

  // CSP exists
  const csp = response.headers.get('content-security-policy')
  t.truthy(csp)
})
