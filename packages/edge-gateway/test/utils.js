import { Miniflare } from 'miniflare'

export function getMiniflare() {
  return new Miniflare({
    // Autoload configuration from `.env`, `package.json` and `wrangler.toml`
    envPath: true,
    scriptPath: 'dist/worker.mjs',
    packagePath: true,
    wranglerConfigPath: true,
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
    wranglerConfigEnv: 'test',
    modules: true,
    mounts: {
      api: {
        scriptPath: './test/scripts/api.js',
        modules: true,
      },
    },
    serviceBindings: {
      API: 'api',
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
