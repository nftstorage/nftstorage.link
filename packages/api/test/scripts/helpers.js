import * as JWT from '../../src/utils/jwt.js'
import { PostgrestClient } from '@supabase/postgrest-js'

import { DBClient } from 'nft.storage-api/src/utils/db-client.js'
import { globals } from './worker-globals.js'

export const client = new DBClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_TOKEN
)

export const rawClient = new PostgrestClient(process.env.DATABASE_URL, {
  headers: {
    Authorization: `Bearer ${process.env.DATABASE_TOKEN}`,
  },
})

/**
 * @param {Object} [options]
 * @param {string} [options.publicAddress]
 * @param {string} [options.issuer]
 * @param {string} [options.name]
 * @param {boolean} [options.grantRequiredTags]
 */
export async function createTestUser({
  publicAddress = `0x73573${Date.now()}`,
  issuer = `did:eth:${publicAddress}`,
  name = 'A Tester',
  grantRequiredTags = false,
} = {}) {
  const token = await JWT.sign(
    {
      sub: issuer,
      iss: 'nft-storage',
      iat: Date.now(),
      name: 'test',
    },
    globals.SALT
  )
  const user = await createTestUserWithFixedToken({
    token,
    publicAddress,
    issuer,
    name,
  })

  if (grantRequiredTags) {
    await grantUserTag(user.userId, 'HasAccountRestriction', false)
    await grantUserTag(user.userId, 'HasSuperHotAccess', true)
  }

  return user
}

/**
 * @param {{publicAddress?: string, issuer?: string, name?: string, token?: string}} userInfo
 */
export async function createTestUserWithFixedToken({
  token = '',
  publicAddress = `0x73572${Date.now()}${(Math.random() + 1)
    .toString(36)
    .substring(7)}`,
  issuer = `did:eth:${publicAddress}`,
  name = 'A Tester',
} = {}) {
  const { data: user, error } = await client
    .upsertUser({
      email: `a.tester@example.org`,
      github_id: issuer,
      magic_link_id: issuer,
      name,
      public_address: publicAddress,
      picture: 'http://example.org/avatar.png',
    })
    .single()

  if (error || !user) {
    console.log('error', error)
    throw new Error('error creating user')
  }

  await client.createKey({
    name: 'test',
    secret: token,
    userId: user.id,
  })

  return { token, userId: user.id, githubId: user.github_id }
}

export async function grantUserTag(userId, tag, value) {
  await createUserTag({
    user_id: userId,
    tag,
    value,
    reason: '',
    inserted_at: new Date().toISOString(),
  })
}

/**
 * Create a new user tag
 *
 * @param {Object} tag
 * @param {number} tag.user_id
 * @param {string} tag.tag
 * @param {string} tag.value
 * @param {string=} tag.deleted_at
 * @param {string} tag.inserted_at
 * @param {string} tag.reason
 */
async function createUserTag(tag) {
  const query = rawClient.from('user_tag')

  const { data, error } = await query.upsert(tag).single()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error('User tag not created.')
  }

  return data
}
