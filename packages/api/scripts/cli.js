#!/usr/bin/env node
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import sade from 'sade'

import { buildCmd } from './build.js'
import { ipfsCmd } from '../node_modules/edge-gateway/scripts/ipfs.js'

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
      composePath: path.join(__dirname, '../docker/docker-compose.yml'),
      containerName: 'ipfs1',
    })
  )

prog.parse(process.argv)
