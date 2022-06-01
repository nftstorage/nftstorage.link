import fs from 'fs'
import path from 'path'
import { PostgrestClient } from '@supabase/postgrest-js'
import { Miniflare } from 'miniflare'

import { globals } from './worker-globals.js'
import { createR2Bucket } from './mocks/r2.js'

export function getMiniflare() {
  let envPath = path.join(process.cwd(), '../../.env')
  if (!fs.statSync(envPath, { throwIfNoEntry: false })) {
    // @ts-ignore
    envPath = true
  }

  return new Miniflare({
    envPath,
    scriptPath: 'dist/worker.mjs',
    port: 8788,
    packagePath: true,
    wranglerConfigPath: true,
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
    wranglerConfigEnv: 'test',
    modules: true,
    bindings: {
      ...globals,
      SUPERHOT: createR2Bucket(),
    },
  })
}

export class NftStorageDBClient {
  /**
   * DB client constructor
   *
   * @param {string} url
   * @param {string} token
   */
  constructor(url, token) {
    this.client = new PostgrestClient(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: `${token}`,
      },
      schema: 'nftstorage',
    })
  }

  /**
   * Upsert user
   */
  upsertUser(user) {
    const query = this.client.from('user')

    return query.upsert(user, { onConflict: 'github_id' })
  }

  /**
   * Create a new auth key
   *
   * @param {Object} key
   * @param {string} key.name
   * @param {string} key.secret
   * @param {number} key.userId
   */
  async createKey(key) {
    const query = this.client.from('auth_key')

    const { data, error } = await query
      .upsert({
        name: key.name,
        secret: key.secret,
        user_id: key.userId,
      })
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error('Auth key not created.')
    }

    return data
  }
}
