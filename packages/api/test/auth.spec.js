import test from 'ava'
import { getMiniflare } from './scripts/utils.js'
import { createTestUser, grantUserTag } from './scripts/helpers.js'

test.beforeEach(async (t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Fails with 401 authentication when no token provided', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
  })
  t.is(response.status, 401)
})

test('Fails with 401 authentication when user invalid token provided', async (t) => {
  const { mf } = t.context
  const user = await createTestUser()

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
    headers: { Authorization: `${user.token}` }, // Not Bearer /token/
  })
  t.is(response.status, 401)
})

test('Fails with 401 authentication when user unexistent token provided', async (t) => {
  const { mf } = t.context
  const fakeToken = 'fake-token'

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${fakeToken}` },
  })
  t.is(response.status, 401)
})

test('Fails with 403 Forbidden when user has account restricted', async (t) => {
  const { mf } = t.context
  const user = await createTestUser()
  await grantUserTag(user.userId, 'HasAccountRestriction', true)

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 403)
})

test('Fails with 403 Forbidden when user does not have super hot access', async (t) => {
  const { mf } = t.context
  const user = await createTestUser()

  const response = await mf.dispatchFetch(getPermaCachePutUrl('test.png'), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token}` },
  })
  t.is(response.status, 403)
})

const getPermaCachePutUrl = (url) =>
  `https://localhost:8788/perma-cache/${encodeURIComponent(url)}`
