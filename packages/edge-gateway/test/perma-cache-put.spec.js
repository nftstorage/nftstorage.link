import test from 'ava'
import { createErrorHtmlContent } from '../src/errors.js'
import { getMiniflare } from './utils.js'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

// PUT /perma-cache
test('Fails when invalid url is provided', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
  })
  t.is(response.status, 400)

  const textResponse = await response.text()
  t.is(
    textResponse,
    createErrorHtmlContent(400, 'invalid URL provided: test.png: Invalid URL')
  )
})

test('Fails when non nftstorage.link url is provided', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl('https://example.com/test.png'),
    { method: 'PUT' }
  )
  t.is(response.status, 400)

  const textResponse = await response.text()
  t.is(
    textResponse,
    createErrorHtmlContent(
      400,
      'invalid URL provided: https://example.com/test.png: not nftstorage.link URL'
    )
  )
})

test('Puts to perma cache IPFS path valid url without directory path', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl(
      'https://localhost:8787/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
    ),
    { method: 'PUT' }
  )
  t.is(response.status, 200)
  // TODO: Validate cache + db content
})

test('Puts to perma cache IPFS path valid url with directory path', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl(
      'https://localhost:8787/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq/path/file.txt'
    ),
    { method: 'PUT' }
  )
  t.is(response.status, 200)
  // TODO: Validate cache + db content
})

test('Puts to perma cache IPFS subdomain valid url without directory path', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl(
      'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787'
    ),
    { method: 'PUT' }
  )
  t.is(response.status, 200)
  // TODO: Validate cache + db content
})

test('Puts to perma cache IPFS subdomain valid url with directory path', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl(
      'https://bafybeifvsmjgbhck72pabliifeo35cew5yhxujfqjxg4g32vr3yv24h6zu.ipfs.localhost:8787/path/file.txt'
    ),
    { method: 'PUT' }
  )
  t.is(response.status, 200)
  // TODO: Validate cache + db content
})

test('Fails to put to perma cache ipfs path with invalid cid', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    getPermaCachePutUrl('https://localhost:8787/ipfs/invalidcid'),
    { method: 'PUT' }
  )
  t.is(response.status, 400)
  const textResponse = await response.text()
  t.is(
    textResponse,
    createErrorHtmlContent(
      400,
      'invalid CID: invalidcid: To parse non base32 or base58btc encoded CID multibase decoder must be provided'
    )
  )
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8787/perma-cache/${encodeURIComponent(url)}`
