#!/usr/bin/env node

import sade from 'sade'

import Cloudflare from './utils/cloudflare.js'
import { itFind as find } from './utils/common.js'

const cli = sade('nftstorage.link-cli')
cli.version('1.0.0')

cli
  .command(
    'deploy-website',
    'Update DNS record with latest Cloudflare Pages production deployment.'
  )
  .option('--email', 'Cloudflare email')
  .option('--key', 'Cloudflare key')
  .option('--zone', 'Cloudflare Zone')
  .option('--project', 'Cloudflare pages project', 'nftstorage.link')
  .option('--account', 'Cloudflare account id')
  .option('--name', 'Record name', 'nftstorage.link')
  .option('--type', 'Record type', 'CNAME')
  .option('--ttl', 'Record TTL', 1)
  .option('--proxied', 'Record should be proxied ?', true)
  .action(
    async (/** @type {import('./types').DeployWebsiteOptions} */ opts) => {
      try {
        const cf = new Cloudflare({ email: opts.email, key: opts.key })
        const deploy = await find(
          cf.deploymentsPaginate({
            accountId: opts.account,
            projectName: opts.project,
            pagination: { per_page: 10 },
          }),
          (/** @type {any} */ i) => {
            const lastRelease =
              i.deployment_trigger.metadata.commit_message.startsWith(
                'chore(main): release'
              )
            return i.environment === 'production' && !lastRelease
          }
        )
        if (
          deploy.latest_stage.status === 'success' &&
          deploy.latest_stage.name === 'deploy'
        ) {
          await cf.upsertDns(opts.zone, {
            content: deploy.url.replace('https://', ''),
            name: opts.name,
            ttl: opts.ttl,
            type: opts.type,
            proxied: opts.proxied,
          })
          console.log(
            `${opts.name} now points to ${deploy.url.replace('https://', '')}`
          )
        } else {
          throw new Error(`Latest Cloudflare production deployment failed`)
        }
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  )

cli.parse(process.argv)
