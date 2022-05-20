import test from 'ava'

import { getMiniflare } from './scripts/utils.js'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Gets metrics content when empty state', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch('https://localhost:8787/metrics')
  const metricsResponse = await response.text()

  t.is(metricsResponse.includes('nftlinkapi_permacache_urls_total 0'), true)
  t.is(metricsResponse.includes('nftlinkapi_permacache_users_total 0'), true)
  t.is(metricsResponse.includes('nftlinkapi_permacache_size_total 0'), true)
  t.is(
    metricsResponse.includes(
      'nftlinkapi_permacache_events_total{type="Put"} 0'
    ),
    true
  )
  t.is(
    metricsResponse.includes(
      'nftlinkapi_permacache_events_total{type="Delete"} 0'
    ),
    true
  )
})
