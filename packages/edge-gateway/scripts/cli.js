#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sade from 'sade'
import { build } from 'esbuild'
import git from 'git-rev-sync'
import Sentry from '@sentry/cli'

import { ipfsCmd } from './ipfs.js'
import { heartbeatCmd } from './heartbeat.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
)

const prog = sade('gateway')

prog
  .command('build')
  .describe('Build the worker.')
  .option('--env', 'Environment', process.env.ENV)
  .action(buildCmd)
  .command('ipfs')
  .describe('Run ipfs node')
  .option('--start', 'Start docker container', false)
  .option('--stop', 'Stop and clean all dockers artifacts', false)
  .action(ipfsCmd)
  .command('heartbeat', 'Ping opsgenie heartbeat')
  .option('--token', 'Opsgenie Token')
  .option('--name', 'Heartbeat Name')
  .action(heartbeatCmd)

async function buildCmd(opts) {
  const sentryRelease = `nft-gateway@${pkg.version}-${opts.env}+${git.short(
    __dirname
  )}`
  console.log(`Building ${sentryRelease}`)

  await build({
    entryPoints: [path.join(__dirname, '..', 'src', 'index.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(__dirname, '..', 'dist', 'worker.mjs'),
    legalComments: 'external',
    define: {
      SENTRY_RELEASE: JSON.stringify(sentryRelease),
      VERSION: JSON.stringify(pkg.version),
      COMMITHASH: JSON.stringify(git.long(__dirname)),
      BRANCH: JSON.stringify(git.branch(__dirname)),
      global: 'globalThis',
    },
    minify: opts.env === 'dev' ? false : true,
    sourcemap: 'external',
  })

  // Sentry release and sourcemap upload
  if (process.env.SENTRY_UPLOAD === 'true') {
    const cli = new Sentry(undefined, {
      authToken: process.env.SENTRY_TOKEN,
      org: 'protocol-labs-it',
      project: 'nft-gateway',
      dist: git.short(__dirname),
    })

    await cli.releases.new(sentryRelease)
    await cli.releases.setCommits(sentryRelease, {
      auto: true,
      ignoreEmpty: true,
      ignoreMissing: true,
    })
    await cli.releases.uploadSourceMaps(sentryRelease, {
      include: [path.join(__dirname, '..', 'dist')],
      ext: ['map', 'mjs'],
    })
    await cli.releases.finalize(sentryRelease)
    await cli.releases.newDeploy(sentryRelease, {
      env: opts.env,
    })
  }
}

prog.parse(process.argv)
