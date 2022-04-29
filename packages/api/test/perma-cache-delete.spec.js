import test from 'ava'

import { encodeKey } from '../src/perma-cache/utils.js'
import { getMiniflare } from './scripts/utils.js'
import { createTestUser } from './scripts/helpers.js'

let user
test.before(async (t) => {
  user = await createTestUser({
    grantRequiredTags: true,
  })
})

test.beforeEach(async (t) => {
  // Create a new Miniflare environment for each test case
  const mf = getMiniflare()
  const ns = await mf.getKVNamespace('PERMACACHE')
  const nsHistory = await mf.getKVNamespace('PERMACACHE_HISTORY')

  t.context = {
    mf,
    user,
    ns,
    nsHistory,
  }
})

// DELETE /perma-cache
test('Can delete perma cache content', async (t) => {
  const { mf, user, ns, nsHistory } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081'

  // Post
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)
  const { normalizedUrl, date } = await responsePost.json()

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

  // Verify both KVs
  const kvKey = encodeKey({
    userId: user.userId,
    r2Key: normalizedUrl,
    date: date,
  })
  const valueNonExistent = await ns.get(kvKey)
  t.falsy(valueNonExistent)

  const { keys } = await nsHistory.list(`${user.userId}`)
  t.is(keys.length, 2)
  t.truthy(keys.find((k) => k.metadata.operation === 'put'))
  t.truthy(keys.find((k) => k.metadata.operation === 'delete'))
  t.is(keys[0].metadata.contentLength, keys[1].metadata.contentLength)

  // Verify R2
  const r2ResponseNonExistent = await r2Bucket.get(normalizedUrl)
  t.falsy(r2ResponseNonExistent)
})

test('Can delete perma cache content with source url', async (t) => {
  const { mf, user, ns, nsHistory } = t.context
  const bindings = await mf.getBindings()
  const r2Bucket = bindings.SUPERHOT
  const url =
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'

  // Post
  const responsePost = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(responsePost.status, 200)
  const { normalizedUrl, sourceUrl, date } = await responsePost.json()

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

  // Verify both KVs
  const kvKey = encodeKey({
    userId: user.userId,
    r2Key: normalizedUrl,
    date: date,
  })
  const valueNonExistent = await ns.get(kvKey)
  t.falsy(valueNonExistent)

  const { keys } = await nsHistory.list(`${user.userId}`)
  t.is(keys.length, 2)
  t.truthy(keys.find((k) => k.metadata.operation === 'put'))
  t.truthy(keys.find((k) => k.metadata.operation === 'delete'))
  t.is(keys[0].metadata.contentLength, keys[1].metadata.contentLength)

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
  const { mf, user, ns, nsHistory } = t.context
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
  const { normalizedUrl, date } = await responsePost2.json()

  // Verify R2
  const r2ResponseExistent = await r2Bucket.get(normalizedUrl)
  t.truthy(r2ResponseExistent)

  // Verify both KVs
  const kvKey = encodeKey({
    userId: user.userId,
    r2Key: normalizedUrl,
    date: date,
  })
  const valueNonExistent = await ns.get(kvKey)
  t.truthy(valueNonExistent)

  const { keys } = await nsHistory.list(`${user.userId}`)
  t.is(keys.length, 3)
  t.is(keys.filter((k) => k.metadata.operation === 'put').length, 2)
  t.is(keys.filter((k) => k.metadata.operation === 'delete').length, 1)
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`
