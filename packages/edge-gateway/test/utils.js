import { concat } from 'uint8arrays/concat'
import { Miniflare } from 'miniflare'

export function getMiniflare() {
  return new Miniflare({
    // Autoload configuration from `.env`, `package.json` and `wrangler.toml`
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
    wranglerConfigEnv: 'test',
    modules: true,
    bindings: {
      SUPERHOT: createR2Bucket(),
    },
  })
}

export function getCIDsTrackerName() {
  return 'CIDSTRACKER'
}

export function getGatewayRateLimitsName() {
  return 'GATEWAYRATELIMITS'
}

export function getSummaryMetricsName() {
  return 'SUMMARYMETRICS'
}

function createR2Bucket() {
  const bucket = new Map()

  return {
    put: async (key, value, putOpts = {}) => {
      let data = new Uint8Array([])
      const reader = value.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          data = concat([data, value])
        }
      } finally {
        reader.releaseLock()
      }

      bucket.set(key, {
        body: data,
        httpMetadata: putOpts.httpMetadata || {},
        customMetadata: putOpts.customMetadata || {},
      })

      return Promise.resolve({
        httpMetadata: putOpts.httpMetadata,
        customMetadata: putOpts.customMetadata,
      })
    },
    get: async (key) => {
      const value = bucket.get(key)
      if (!value) {
        return undefined
      }

      const response = new Response(value.body, { status: 200 })

      return Promise.resolve(
        Object.assign(response, {
          httpMetadata: value.httpMetadata || {},
          customMetadata: value.customMetadata || {},
        })
      )
    },
    head: async (key) => {
      const value = bucket.get(key)
      if (!value) {
        return undefined
      }

      return Promise.resolve({
        httpMetadata: value.httpMetadata || {},
        customMetadata: value.customMetadata || {},
      })
    },
  }
}
