import debug from 'debug'
import settle from 'p-settle'

import { MAX_CONCURRENT_QUERIES } from '../lib/utils.js'
const log = debug('metrics:updateMetrics')

/**
 * @typedef {import('pg').Pool} Client
 * @typedef {{ name: string, value: number }} Metric
 */

const COUNT_USERS = `
SELECT COUNT(*) AS total
FROM nftstorage.user_tag
WHERE tag = 'HasSuperHotAccess'::user_tag_type AND value = 'true'
`

const COUNT_URLS = `
SELECT COUNT(*) AS total
FROM perma_cache
`

const COUNT_EVENTS_PER_TYPE = `
SELECT COUNT(*) AS total
FROM perma_cache_event
WHERE type = $1
`

const SUM_SIZE = `
SELECT COALESCE(SUM(size),0) AS total
FROM perma_cache
`

const UPDATE_METRIC = `
INSERT INTO metric (name, value, updated_at)
     VALUES ($1, $2, TIMEZONE('utc', NOW()))
ON CONFLICT (name) DO UPDATE
        SET value = $2, updated_at = TIMEZONE('utc', NOW())
`

/**
 * Calculate metrics from RO DB and update their current values in the RW DB.
 *
 * @param {{ rwPg: Client, roPg: Client }} config
 */
export async function updateMetrics({ roPg, rwPg }) {
  const results = await settle([
    withTimeLog('updateUsersCount', () => updateUsersCount(roPg, rwPg)),
    withTimeLog('updateUrlsCount', () => updateUrlsCount(roPg, rwPg)),
    withTimeLog('updatePutEventsCount', () =>
      updateEventsCount(roPg, rwPg, 'Put')
    ),
    withTimeLog('updateDeleteEventsCount', () =>
      updateEventsCount(roPg, rwPg, 'Delete')
    ),
    withTimeLog('updateSizeSum', () => updateSizeSum(roPg, rwPg)),
    { concurrency: MAX_CONCURRENT_QUERIES },
  ])

  let error
  for (const promise of results) {
    if (promise.isFulfilled) continue
    error = error || promise.reason
    console.error(promise.reason)
  }

  if (error) throw error
  log('✅ Done')
}

/**
 * @param {Client} roPg
 * @param {Client} rwPg
 */
async function updateUsersCount(roPg, rwPg) {
  const { rows } = await roPg.query(COUNT_USERS)
  if (!rows.length) throw new Error('no rows returned counting users')
  await rwPg.query(UPDATE_METRIC, ['users_total', rows[0].total])
}

/**
 * @param {Client} roPg
 * @param {Client} rwPg
 */
async function updateUrlsCount(roPg, rwPg) {
  const { rows } = await roPg.query(COUNT_URLS)
  if (!rows.length) throw new Error('no rows returned counting urls')
  return rwPg.query(UPDATE_METRIC, ['urls_total', rows[0].total])
}

/**
 * @param {Client} roPg
 * @param {Client} rwPg
 * @param {'Put' | 'Delete'} type
 */
async function updateEventsCount(roPg, rwPg, type) {
  const { rows } = await roPg.query(COUNT_EVENTS_PER_TYPE, [type])
  if (!rows.length) throw new Error('no rows returned counting events')
  return rwPg.query(UPDATE_METRIC, [
    `events_${type.toLowerCase()}_total`,
    rows[0].total,
  ])
}

/**
 * @param {Client} roPg
 * @param {Client} rwPg
 */
async function updateSizeSum(roPg, rwPg) {
  const { rows } = await roPg.query(SUM_SIZE)
  if (!rows.length) throw new Error('no rows returned summing sizes')
  await rwPg.query(UPDATE_METRIC, ['size_total', rows[0].total])
}

/**
 * @template T
 * @param {string} name
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
async function withTimeLog(name, fn) {
  const start = Date.now()
  try {
    return await fn()
  } finally {
    log(`${name} took: ${Date.now() - start}ms`)
  }
}
