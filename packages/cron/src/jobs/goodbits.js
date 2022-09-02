import fetch, { Headers } from '@web-std/fetch'
import path from 'path'
import toml from 'toml'
// @ts-ignore no types in module
import ndjson from 'iterable-ndjson'

/**
 * @typedef {{ id: string, title: string }} Namespace
 * @typedef {{ name: string, metadata: any }} Key
 * @typedef {{ key: string, value: any, metadata?: any }} BulkWritePair
 */

const GOODBITS_SOURCES = [
  'https://raw.githubusercontent.com/nftstorage/goodbits/main/list.ndjson',
]

const rootDir = path.dirname(path.dirname(import.meta.url))
const wranglerConfigPath = path.join(
  rootDir,
  '../../edge-gateway/wrangler.toml'
)

/**
 * @param {{ env: string } } opts
 */
export async function sync({ env }) {
  const cfApiToken = mustGetEnv('CF_API_TOKEN')
  const ghToken = mustGetEnv('GH_TOKEN')

  const wranglerConfig = await getWranglerToml(wranglerConfigPath)
  const wranglerEnvConfig = wranglerConfig.env[env]
  if (!wranglerEnvConfig) {
    throw new Error(`missing wrangler configuration for env: ${env}`)
  }
  console.log(`🧩 using wrangler config: ${wranglerConfigPath}`)

  const cfAccountId = wranglerEnvConfig.account_id
  if (!cfAccountId) {
    throw new Error(`missing Cloudflare account_id in env: ${env}`)
  }
  console.log(`🏕 using env: ${env} (${cfAccountId})`)

  const kvNamespaces = wranglerEnvConfig.kv_namespaces || []
  const goodbitsListKv = kvNamespaces.find(
    (kv) => kv.binding === 'GOODBITSLIST'
  )
  if (!goodbitsListKv) {
    throw new Error('missing binding in kv_namespaces: GOODBITSLIST')
  }
  console.log(`🪢 using KV binding: GOODBITSLIST (${goodbitsListKv.id})`)

  for (const url of GOODBITS_SOURCES) {
    console.log(`🦴 fetching ${url}`)
    const goodbitsList = await getGoodbitsList(url, ghToken)

    const kvs = []
    for await (const { cid, tags } of goodbitsList) {
      kvs.push({
        key: cid,
        value: { tags },
      })
    }

    console.log(`📝 writing ${kvs.length} entries`)
    await writeKVMulti(cfApiToken, cfAccountId, goodbitsListKv.id, kvs)
  }

  console.log('✅ Done')
}

/**
 * @param {string} apiToken Cloudflare API token
 * @param {string} accountId Cloudflare account ID
 * @param {string} nsId KV namespace ID
 * @param {Array<BulkWritePair>} kvs
 * @returns {Promise<void>}
 */
async function writeKVMulti(apiToken, accountId, nsId, kvs) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${nsId}/bulk`
  kvs = kvs.map((kv) => ({
    ...kv,
    value: JSON.stringify(kv.value),
  }))

  const chunkSize = 10000
  for (let i = 0; i < kvs.length; i += chunkSize) {
    const kvsChunk = kvs.slice(i, i + chunkSize)
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kvsChunk),
    })
    const { success, errors } = await res.json()
    if (!success) {
      const error = Array.isArray(errors) && errors[0]
      throw new Error(
        error ? `${error.code}: ${error.message}` : 'failed to write to KV'
      )
    }
  }
}

/**
 * @param {string} url
 * @param {string} ghToken
 */
async function getGoodbitsList(url, ghToken) {
  const headers = new Headers()
  headers.append('authorization', `token ${ghToken}`)
  headers.append('cache-control', 'no-cache')
  headers.append('pragma', 'no-cache')

  const res = await fetch(url, {
    headers,
  })
  if (!res.ok) {
    throw new Error(`unexpected status fetching goodbits list: ${res.status}`)
  }
  return ndjson.parse(await res.text())
}

async function getWranglerToml(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`unexpected status fetching wrangler.toml: ${res.status}`)
  }
  return toml.parse(await res.text())
}

/**
 * @param {string} key
 * @returns {string}
 */
function mustGetEnv(key) {
  if (process.env[key]) {
    throw new Error(`missing environment variable: ${key}`)
  }
  // @ts-ignore validation of undefined before not accepted by ts compiler
  return process.env[key]
}
