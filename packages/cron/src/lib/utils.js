import pg from 'pg'

export const MAX_CONCURRENT_QUERIES = 10

/**
 * Create a new Postgres pool instance from the passed environment variables.
 * @param {Record<string, string|undefined>} env
 * @param {'ro'|'rw'} [mode]
 */
export function getPgPool(env, mode = 'rw') {
  return new pg.Pool({
    connectionString: getPgConnString(env, mode),
    max: MAX_CONCURRENT_QUERIES,
  })
}

/**
 * Get a postgres connection string from the passed environment variables.
 * @param {Record<string, string|undefined>} env
 * @param {'ro'|'rw'} [mode]
 */
function getPgConnString(env, mode = 'rw') {
  let connectionString
  if (env.ENV === 'production') {
    connectionString =
      mode === 'rw'
        ? env.PROD_DATABASE_CONNECTION
        : env.PROD_RO_DATABASE_CONNECTION
  } else if (env.ENV === 'staging') {
    connectionString =
      mode === 'rw'
        ? env.STAGING_DATABASE_CONNECTION
        : env.STAGING_RO_DATABASE_CONNECTION
  } else {
    connectionString =
      mode === 'rw' ? env.DATABASE_CONNECTION : env.RO_DATABASE_CONNECTION
  }
  if (!connectionString) throw new Error('missing Postgres connection string')
  return connectionString
}
