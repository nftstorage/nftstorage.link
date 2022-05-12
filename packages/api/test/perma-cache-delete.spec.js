import test from 'ava'

import { getMiniflare } from './scripts/utils.js'
import { createTestUser, dbClient } from './scripts/helpers.js'
import { getParsedUrl } from './utils.js'

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

// DELETE /perma-cache
test('Can delete perma cache content', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081/'

  // Post
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)
  const { normalizedUrl } = getParsedUrl(url)

  // Verify R2
  const r2ResponseExistent = await r2Bucket.get(normalizedUrl)
  t.truthy(r2ResponseExistent)

  // Delete
  const responseDelete = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responseDelete.status, 200)
  const success = await responseDelete.json()
  t.truthy(success)

  // Verify Value set as deleted
  const { data } = await dbClient._client
    .from('perma_cache')
    .select(
      `
      url,
      deletedAt:deleted_at
      `
    )
    .eq('user_id', user.userId)
    .single()
  t.truthy(data.deletedAt)
  t.is(data.url, url)

  // Verify R2
  const r2ResponseNonExistent = await r2Bucket.get(normalizedUrl)
  t.falsy(r2ResponseNonExistent)
})

test('Can delete perma cache content with source url', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq/'

  const { normalizedUrl } = getParsedUrl(url)
  // Post
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)
  const { url: sourceUrl } = await responsePost.json()

  // Delete
  const responseDelete = await mf.dispatchFetch(
    getPermaCachePutUrl(sourceUrl),
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(responseDelete.status, 200)
  const success = await responseDelete.json()
  t.truthy(success)

  // Verify Value set as deleted
  const { data } = await dbClient._client
    .from('perma_cache')
    .select(
      `
      url,
      deletedAt:deleted_at
      `
    )
    .eq('user_id', user.userId)
    .single()
  t.truthy(data.deletedAt)
  t.is(data.url, url)

  // Verify R2
  const r2ResponseNonExistent = await r2Bucket.get(normalizedUrl)
  t.falsy(r2ResponseNonExistent)
})

test('Fails to delete unexistent perma cache content', async (t) => {
  const { mf, user } = t.context
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081'
  // Delete
  const responseDelete = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responseDelete.status, 200)
  const success = await responseDelete.json()
  t.falsy(success)
})

test('Can add content that was previously deleted', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081'

  // Post 1
  const responsePost1 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost1.status, 200)

  // Delete
  const responseDelete = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responseDelete.status, 200)
  const success = await responseDelete.json()
  t.truthy(success)

  // Post 2
  const responsePost2 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost2.status, 200)
  const { normalizedUrl } = getParsedUrl(url)

  // Verify R2
  const r2ResponseExistent = await r2Bucket.get(normalizedUrl)
  t.truthy(r2ResponseExistent)

  // Verify Value set as deleted and 2 rows
  const { data } = await dbClient._client
    .from('perma_cache')
    .select(
      `
      url,
      deletedAt:deleted_at
      `
    )
    .eq('user_id', user.userId)
  t.is(data.length, 2)
  t.truthy(data[0].deletedAt)
  t.falsy(data[1].deletedAt)
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`
