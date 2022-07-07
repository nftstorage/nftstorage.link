import test from 'ava'

import { getMiniflare } from './scripts/utils.js'
import { createTestUser } from './scripts/helpers.js'
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

test('Gets content from perma cache by URL', async (t) => {
  const { mf, user } = t.context

  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
  const gatewayTxtResponse = 'Hello nft.storage! 😎'

  // Post URL content to perma cache
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)

  // GET URL content from perma cache
  const { normalizedUrl } = getParsedUrl(url)

  const responseGet = await mf.dispatchFetch(
    getPermaCachePutUrl(normalizedUrl),
    {
      method: 'GET',
    }
  )
  t.is(responseGet.status, 200)
  t.deepEqual(await responseGet.text(), gatewayTxtResponse)
})

test('Gets range content from perma cache by URL', async (t) => {
  const { mf, user } = t.context

  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
  const gatewayTxtResponse = 'Hello nft.storage! 😎'

  // Post URL content to perma cache
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)

  // GET URL content from perma cache
  const { normalizedUrl } = getParsedUrl(url)

  const responseGet = await mf.dispatchFetch(
    getPermaCachePutUrl(normalizedUrl),
    {
      method: 'GET',
      headers: {
        Range: 'bytes=0-2',
      },
    }
  )
  t.is(responseGet.status, 206)
  t.deepEqual(await responseGet.text(), gatewayTxtResponse.slice(0, 2 + 1)) // range includes
})

test('Gets 404 response from perma cache by URL when url not perma cached', async (t) => {
  const { mf } = t.context
  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'

  // GET URL content from perma cache
  const { normalizedUrl } = getParsedUrl(url)
  const responseGet = await mf.dispatchFetch(
    getPermaCachePutUrl(normalizedUrl),
    {
      method: 'GET',
    }
  )
  t.is(responseGet.status, 404)
})
