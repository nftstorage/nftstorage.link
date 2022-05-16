import { PostgrestClient, PostgrestQueryBuilder } from '@supabase/postgrest-js'

import { HTTP_STATUS_CONFLICT } from '../constants.js'
import { DBError, ConstraintError } from '../errors.js'

export class DBClient {
  constructor({ endpoint, token }) {
    this._client = new PostgrestClient(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    })
    this._clientNftStorage = new PostgrestClient(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
      schema: 'nftstorage',
    })
  }

  /**
   * @param {Object} permaCache
   * @param {number} permaCache.userId
   * @param {string} permaCache.normalizedUrl
   * @param {string} permaCache.sourceUrl
   * @param {number} permaCache.size
   */
  async createPermaCache(permaCache) {
    const { data, error, status } = await this._client.rpc(
      'create_perma_cache',
      {
        data: {
          user_id: permaCache.userId,
          normalized_url: permaCache.normalizedUrl,
          source_url: permaCache.sourceUrl,
          size: permaCache.size,
        },
      }
    )

    if (error) {
      if (status === HTTP_STATUS_CONFLICT) {
        throw new ConstraintError({
          message: 'URL already found for user',
        })
      }
      throw new DBError(error)
    }

    if (!data) {
      throw new Error('Perma cache not created.')
    }

    return data[0]
  }

  /**
   * Get perma cache Entry
   *
   * @param {number} userId
   * @param {string} url
   * @return {Promise<{ url: string, size: number }>}
   */
  async getPermaCache(userId, url) {
    const { data, error } = await this._client
      .from('perma_cache')
      .select(
        `
      url:source_url,
      size,
      insertedAt:inserted_at
      `
      )
      .eq('user_id', userId)
      .eq('normalized_url', url)

    if (error) {
      throw new DBError(error)
    }
    return data[0]
  }

  /**
   * List perma cache
   *
   * @param {number} userId
   * @param {Object} opts
   * @param {number} opts.size
   * @param {number} opts.page
   * @param {'date'|'size'} opts.sort
   * @param {'cesc'|'asc'} opts.order
   * @return {Promise<Array<{ url: string, size: number, insertedAt: string }>>}
   */
  async listPermaCache(userId, opts) {
    let query = this._client
      .from('perma_cache')
      .select(
        `
      url:source_url,
      size,
      insertedAt:inserted_at
      `
      )
      .eq('user_id', userId)
      .limit(opts.size)
      .range(opts.page * opts.size, (opts.page + 1) * opts.size - 1)
      .order(opts.sort === 'size' ? 'size' : 'inserted_at', {
        ascending: opts.order === 'asc',
      })

    const { data, error } = await query

    if (error) {
      throw new DBError(error)
    }

    return data
  }

  /**
   * List perma cache
   *
   * @param {number} userId
   * @param {string} url
   */
  async deletePermaCache(userId, url) {
    const { data } = await this._client.rpc('delete_perma_cache', {
      data: {
        user_id: userId,
        normalized_url: url,
      },
    })

    if (!data || !data.length) {
      return undefined
    }

    return {
      id: data[0].id,
    }
  }

  /**
   * Get perma cache storage in bytes.
   *
   * @param {number} userId
   * @returns {Promise<number>}
   */
  async getUsedPermaCacheStorage(userId) {
    const { data, error } = await this._client
      .rpc('user_used_perma_cache_storage', { query_user_id: userId })
      .single()

    if (error) {
      throw new DBError(error)
    }

    return data || 0
  }

  /**
   * Get user by did
   *
   * @param {string} id
   */
  async getUser(id) {
    /** @type {PostgrestQueryBuilder<import('nft.storage-api/src/utils/db-client-types').UserOutput>} */
    const query = this._clientNftStorage.from('user')

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
      .or(`magic_link_id.eq.${id},github_id.eq.${id},did.eq.${id}`)
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
    const { data, error } = await this._clientNftStorage
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
