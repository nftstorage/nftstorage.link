import test from 'ava'

import { getMiniflare } from './scripts/utils.js'
import { createTestUser } from './scripts/helpers.js'

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

test('Get perma-cache status from user', async (t) => {
  const { mf, user } = t.context
  const statusResponseEmpty = await mf.dispatchFetch(
    'https://localhost:8788/perma-cache/status',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(statusResponseEmpty.status, 200)

  const statusEmpty = await statusResponseEmpty.json()
  t.is(statusEmpty.usedStorage, 0)

  const url =
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081'
  const response = await mf.dispatchFetch(getPermaCachePutUrl(url), {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 200)
  const body = await response.json()

  const statusResponseNotEmpty = await mf.dispatchFetch(
    'https://localhost:8788/perma-cache/status',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(statusResponseNotEmpty.status, 200)

  const statusNotEmpty = await statusResponseNotEmpty.json()
  t.is(statusNotEmpty.usedStorage, String(body.size))
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`
