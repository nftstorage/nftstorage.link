import ava from 'ava'

import { getMiniflare } from './scripts/utils.js'
import { createTestUser, dbClient } from './scripts/helpers.js'
import { getParsedUrl } from './utils.js'

ava.beforeEach(async (t) => {
  const user = await createTestUser({
    grantRequiredTags: true,
  })

  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
    user,
  }
})

const test = ava.serial

// DELETE /perma-cache
test('Can delete perma cache content', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://bafkreibxkbyybantsznyvlq2bhf24u4gew7pj6erjgduqp4mvqv54qjng4.ipfs.localhost:9081/'

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
    .from('perma_cache_event')
    .select(
      `
      type
      `
    )
    .eq('user_id', user.userId)
    .eq('normalized_url', url)
  t.is(data.length, 2)
  // Exists PUT event
  t.truthy(data.find((event) => event.type === 'Put'))
  // Exists DELETE event
  t.truthy(data.find((event) => event.type === 'Delete'))

  // Verify R2
  const r2ResponseNonExistent = await r2Bucket.get(normalizedUrl)
  t.falsy(r2ResponseNonExistent)
})

test('Can delete perma cache content with source url', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://localhost:9081/ipfs/bafkreibxkbyybantsznyvlq2bhf24u4gew7pj6erjgduqp4mvqv54qjng4/'

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
    .from('perma_cache_event')
    .select(
      `
      type
      `
    )
    .eq('user_id', user.userId)
    .eq('normalized_url', normalizedUrl)
  t.is(data.length, 2)
  // Exists PUT event
  t.truthy(data.find((event) => event.type === 'Put'))
  // Exists DELETE event
  t.truthy(data.find((event) => event.type === 'Delete'))

  // Verify R2
  const r2ResponseNonExistent = await r2Bucket.get(normalizedUrl)
  t.falsy(r2ResponseNonExistent)
})

test('Fails to delete unexistent perma-cache content', async (t) => {
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
    'http://bafkreibxkbyybantsznyvlq2bhf24u4gew7pj6erjgduqp4mvqv54qjng4.ipfs.localhost:9081'

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

  // Verify Value set as deleted and 3 rows
  const { data } = await dbClient._client
    .from('perma_cache_event')
    .select(
      `
      type
      `
    )
    .eq('user_id', user.userId)
    .eq('normalized_url', normalizedUrl)
  t.is(data.length, 3)
  // Exists 2 PUT events
  t.is(data.filter((event) => event.type === 'Put').length, 2)
  // Exists DELETE event
  t.truthy(data.find((event) => event.type === 'Delete'))
})

test('should not delete from R2 bucket if url was perma-cached by other user', async (t) => {
  const { mf, user } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://bafkreihbjbbccwxn7hzv5hun5pxuswide7q3lhjvfbvmd7r3kf2sodybgi.ipfs.localhost:9081'

  // Post 1
  const responsePost1 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost1.status, 200)

  // Post 2
  const user2 = await createTestUser({
    grantRequiredTags: true,
  })
  const responsePost2 = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user2.token}` },
  })
  t.is(responsePost2.status, 200)

  // Delete
  const responseDelete = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responseDelete.status, 200)
  const success = await responseDelete.json()
  t.truthy(success)

  // Verify R2
  const { normalizedUrl } = getParsedUrl(url)
  const r2ResponseExistent = await r2Bucket.get(normalizedUrl)
  t.truthy(r2ResponseExistent)
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`
