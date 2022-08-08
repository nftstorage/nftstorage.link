#!/usr/bin/env node

import sade from 'sade'

import { buildCmd } from './build.js'

const env = process.env.ENV || 'dev'
const prog = sade('edge-gateway-nftstorage.link')

prog
  .command('build')
  .describe('Build the worker.')
  .option('--env', 'Environment', env)
  .action(buildCmd)

prog.parse(process.argv)
