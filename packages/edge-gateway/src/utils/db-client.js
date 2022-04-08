import { PostgrestClient } from '@supabase/postgrest-js'

import { ConstraintError, DBError } from '../errors.js'

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
   * Get user by its issuer.
   *
   * @param {string} issuer
   * @return {Promise<import('./db-client-types').UserOutput | undefined>}
   */
  async getUser(issuer) {
    /** @type {{ data: import('./db-client-types').UserOutput[], error: PostgrestError }} */
    const { data, error } = await this._client
      .from('user')
      .select(
        `
        _id:id::text,
        issuer,
        name,
        email,
        github,
        publicAddress:public_address,
        created:inserted_at,
        updated:updated_at
      `
      )
      .eq('issuer', issuer)

    if (error) {
      throw new DBError(error)
    }

    return data.length ? data[0] : undefined
  }
}
