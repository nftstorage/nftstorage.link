#!/usr/bin/env node

import { sync } from '../jobs/goodbits.js'
import { envConfig } from '../lib/env.js'

async function main() {
  await sync({
    env: process.env.ENV || 'dev',
  })
}

envConfig()
main()
