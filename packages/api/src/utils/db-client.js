import { PostgrestClient, PostgrestQueryBuilder } from '@supabase/postgrest-js'

import { DBError, ConstraintError } from '../errors.js'

export class DBClient {
  constructor({ endpoint, token }) {
    this._client = new PostgrestClient(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    })
  }

  /**
   * Get user by did
   *
   * @param {string} id
   */
  async getUser(id) {
    /** @type {PostgrestQueryBuilder<import('nft.storage-api/src/utils/db-client-types').UserOutput>} */
    const query = this._client.from('user')

    let select = query
      .select(
        `
        id,
        github_id,
        did,
        keys:auth_key_user_id_fkey(user_id,id,name,secret),
        tags:user_tag_user_id_fkey(user_id,id,tag,value)
        `
      )
      .or(`github_id.eq.${id},did.eq.${id}`)
      // @ts-ignore
      .filter('keys.deleted_at', 'is', null)
      // @ts-ignore
      .filter('tags.deleted_at', 'is', null)

    const { data, error, status } = await select.single()

    if (status === 406 || !data) {
      return
    }
    if (error) {
      throw new DBError(error)
    }

    return data
  }

  /**
   * Returns all the active (non-deleted) user tags for a user id.
   *
   * @param {number} userId
   * @returns {Promise<{ tag: string, value: string }[]>}
   */
  async getUserTags(userId) {
    const { data, error } = await this._client
      .from('user_tag')
      .select(
        `
        tag,
        value
      `
      )
      .eq('user_id', userId)
      .filter('deleted_at', 'is', null)

    if (error) {
      throw new DBError(error)
    }

    // Ensure active user tags are unique.
    const tags = new Set()
    data.forEach((item) => {
      if (tags.has(item.tag)) {
        throw new ConstraintError({
          message: `More than one row found for user tag ${item.tag}`,
        })
      }
      tags.add(item.tag)
    })

    return data
  }
}
