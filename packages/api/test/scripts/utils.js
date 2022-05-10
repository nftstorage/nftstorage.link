import fs from 'fs'
import path from 'path'
import { Miniflare } from 'miniflare'

import { globals } from './worker-globals.js'
import { createR2Bucket } from './mocks/r2.js'

export function getMiniflare() {
  let envPath = path.join(process.cwd(), '../../.env')
  if (!fs.statSync(envPath, { throwIfNoEntry: false })) {
    // @ts-ignore
    envPath = true
  }

  return new Miniflare({
    envPath,
    port: 8788,
    packagePath: true,
    wranglerConfigPath: true,
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
    wranglerConfigEnv: 'test',
    modules: true,
    bindings: {
      ...globals,
      // Cloudflare R2
      SUPERHOT: createR2Bucket(),
      // Cloudflare Service Binding
      GATEWAY: {
        fetch,
      },
    },
  })
}
