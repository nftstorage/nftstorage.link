import test from 'ava'
import pMap from 'p-map'

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

// PUT /perma-cache
test('Gets empty list when there were no perma-cached objects previously added', async (t) => {
  const { mf, user } = t.context
  const response = await mf.dispatchFetch(
    'https://localhost:8788/perma-cache',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(response.status, 200)

  const entries = await response.json()
  t.is(entries.length, 0)
})

test('Gets list when there were perma-cached objects previously added', async (t) => {
  const { mf, user } = t.context

  // Perma cache URLs
  const urls = [
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081?download=true',
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq',
    'http://localhost:9081/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
  ]
  await pMap(
    urls,
    async (url) => {
      const putResponse = await mf.dispatchFetch(getPermaCachePutUrl(url), {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      t.is(putResponse.status, 200)
    },
    { concurrency: 1 }
  )

  // Get URLs
  const listResponse = await mf.dispatchFetch(
    'https://localhost:8788/perma-cache',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    }
  )
  t.is(listResponse.status, 200)

  const entries = await listResponse.json()
  t.is(entries.length, urls.length)

  // Validate content
  validateList(t, urls, entries)
})

test('Can paginate list', async (t) => {
  const { mf, user } = t.context

  // Perma-cache URLs
  const urls = [
    'http://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:9081?download=true',
    'http://localhost:9081/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq',
    'http://localhost:9081/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
  ]
  await pMap(
    urls,
    async (url) => {
      const putResponse = await mf.dispatchFetch(getPermaCachePutUrl(url), {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      t.is(putResponse.status, 200)
    },
    { concurrency: 1 }
  )

  const pages = []
  const size = 2

  let nextPageLink = `https://localhost:8788/perma-cache?size=${size}`
  do {
    const listResponse = await mf.dispatchFetch(nextPageLink, {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    })
    t.is(listResponse.status, 200)

    const entries = await listResponse.json()
    pages.push(entries)

    const link = listResponse.headers.get('link')
    if (link) {
      nextPageLink = `https://localhost:8788${link
        .replace('<', '')
        .replace('>; rel="next"', '')}`
    } else {
      nextPageLink = undefined
    }
  } while (nextPageLink)

  t.is(pages.length, Math.round(urls.length / size))

  const allPages = pages.flat()
  t.is(allPages.length, urls.length)

  // Validate content
  validateList(t, urls, allPages)
})

const validateList = (t, urls, entries) => {
  urls.forEach((url) => {
    const { sourceUrl } = getParsedUrl(url)

    const target = entries.find((e) => sourceUrl === e.url)
    t.is(sourceUrl, target.url)
    t.truthy(target.insertedAt)
    t.truthy(target.size)
  })
}
