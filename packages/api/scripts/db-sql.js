import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import retry from 'p-retry'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { Client } = pg

/**
 * @param {{ reset?: boolean; nftstorage?: boolean; testing?: boolean; }} opts
 */
export async function dbSqlCmd(opts) {
  if (opts.nftstorage && !opts.testing) {
    expectEnv('NFT_STORAGE_HOST')
    expectEnv('NFT_STORAGE_DATABASE')
    expectEnv('NFT_STORAGE_USER')
    expectEnv('NFT_STORAGE_PASSWORD')
  }
  expectEnv('DATABASE_CONNECTION')

  const { env } = process
  const configSql = loadSql('config.sql')
  const tables = loadSql('tables.sql')
  const reset = loadSql('reset.sql')
  const nftstorage = loadSql('nftstorage.sql')
  const nftstorageTesting = loadSql('nftstorage.testing.sql')
  const fdw = loadSql('fdw.sql')
  const functions = loadSql('functions.sql')
    // Replace secrets in the FDW sql file
    .replace(":'NFT_STORAGE_HOST'", `'${env.NFT_STORAGE_HOST}'`)
    .replace(":'NFT_STORAGE_DATABASE'", `'${env.NFT_STORAGE_DATABASE}'`)
    .replace(":'NFT_STORAGE_USER'", `'${env.NFT_STORAGE_USER}'`)
    .replace(":'NFT_STORAGE_PASSWORD'", `'${env.NFT_STORAGE_PASSWORD}'`)
    .replace(':NFT_LINK_USER', env.NFT_LINK_USER || 'CURRENT_USER')
    .replace(':NFT_LINK_STATS_USER', env.NFT_LINK_STATS_USER || 'CURRENT_USER')

  const client = await getDbClient(env.DATABASE_CONNECTION)

  if (opts.reset) {
    await client.query(reset)
  }

  await client.query(configSql)
  await client.query(tables)

  if (opts.nftstorage) {
    if (opts.testing) {
      await client.query(nftstorageTesting)
    } else {
      await client.query(fdw)
      await client.query(nftstorage)
    }
  }
  await client.query(functions)

  await client.end()
}

/**
 * @param {string|undefined} connectionString
 */
function getDbClient(connectionString) {
  return retry(
    async () => {
      const c = new Client({ connectionString })
      await c.connect()
      return c
    },
    { minTimeout: 100 }
  )
}

/**
 * @param {string} name
 */
function expectEnv(name) {
  if (!process.env[name]) {
    throw new Error(`missing environment variable: ${name}`)
  }
}

/**
 * @param {string} file
 */
function loadSql(file) {
  return fs.readFileSync(path.join(__dirname, '..', 'db', file), 'utf8')
}
