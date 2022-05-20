/* global Response caches */

import { METRICS_CACHE_MAX_AGE } from './constants.js'

/**
 * Retrieve metrics in prometheus exposition format.
 * https://prometheus.io/docs/instrumenting/exposition_formats/
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {import('./index').Ctx} ctx
 * @returns {Promise<Response>}
 */
export async function metricsGet(request, env, ctx) {
  const cache = caches.default
  let res = await cache.match(request)
  if (res) {
    return res
  }

  const [usersTotal, urlsTotal, putEventsTotal, deleteEventsTotal, sizeTotal] =
    await Promise.all([
      env.db.getMetricsValue('users_total'),
      env.db.getMetricsValue('urls_total'),
      env.db.getMetricsValue('events_put_total'),
      env.db.getMetricsValue('events_delete_total'),
      env.db.getMetricsValue('size_total'),
    ])

  const metrics = [
    `# HELP nftlinkapi_permacache_urls_total Total perma-cached urls.`,
    `# TYPE nftlinkapi_permacache_urls_total counter`,
    `nftlinkapi_permacache_urls_total ${urlsTotal}`,
    `# HELP nftlinkapi_permacache_users_total Total number of users with perma-cached urls.`,
    `# TYPE nftlinkapi_permacache_users_total counter`,
    `nftlinkapi_permacache_users_total ${usersTotal}`,
    `# HELP nftlinkapi_permacache_size_total Total perma-cached size.`,
    `# TYPE nftlinkapi_permacache_size_total counter`,
    `nftlinkapi_permacache_size_total ${sizeTotal}`,
    `# HELP nftlinkapi_permacache_events_total Total perma-cache events.`,
    `# TYPE nftlinkapi_permacache_events_total counter`,
    `nftlinkapi_permacache_events_total{type="Put"} ${putEventsTotal}`,
    `nftlinkapi_permacache_events_total{type="Delete"} ${deleteEventsTotal}`,
  ].join('\n')

  res = new Response(metrics, {
    headers: {
      'Cache-Control': `public, max-age=${METRICS_CACHE_MAX_AGE}`,
    },
  })
  ctx.waitUntil(cache.put(request, res.clone()))

  return res
}
