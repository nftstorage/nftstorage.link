#!/usr/bin/env node
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import sade from 'sade'

import { buildCmd } from './build.js'
import { dbCmd } from './db.js'
import { dbSqlCmd } from './db-sql.js'
import { ipfsCmd } from './ipfs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({
  path: path.join(__dirname, '..', '..', '..', '.env'),
})

const prog = sade('nftstorage.link-api')

prog
  .command('build')
  .describe('Build the worker.')
  .option('--env', 'Environment', process.env.ENV)
  .action(buildCmd)
  .command('ipfs')
  .describe('Run ipfs node')
  .option('--start', 'Start docker container', false)
  .option('--stop', 'Stop and clean all dockers artifacts', false)
  .action((opts) =>
    ipfsCmd({
      ...opts,
      composePath: path.join(__dirname, '../docker/docker-ipfs.yml'),
      containerName: 'ipfs1',
    })
  )
  .command('db')
  .describe('Run docker compose to setup pg and pgrest')
  .option('--init', 'Init docker container', false)
  .option('--start', 'Start docker container', false)
  .option('--stop', 'Stop docker container', false)
  .option('--project', 'Project name', 'nftstoragelink-api')
  .option('--clean', 'Clean all dockers artifacts', false)
  .action(dbCmd)
  .command('db-sql')
  .describe('Database scripts')
  .option('--reset', 'Reset db before running SQL.', false)
  .option('--cargo', 'Import cargo data.', false)
  .option('--testing', 'Tweak schema for testing.', false)
  .action(dbSqlCmd)

prog.parse(process.argv)
