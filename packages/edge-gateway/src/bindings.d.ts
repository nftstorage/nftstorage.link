import Toucan from 'toucan-js'

export {}

export interface EnvInput {
  ENV: string
  DEBUG: string
  SENTRY_DSN?: string
  LOKI_URL?: string
  LOKI_TOKEN?: string
  EDGE_GATEWAY: Fetcher
  GATEWAY_HOSTNAME: string
  CSP_REPORT_URI: string
  GOODBITSLIST: KVNamespace
}

export interface EnvTransformed {
  VERSION: string
  BRANCH: string
  COMMITHASH: string
  SENTRY_RELEASE: string
  IPFS_GATEWAY_HOSTNAME: string
  IPNS_GATEWAY_HOSTNAME: string
  sentry?: Toucan
  startTime: number
}

export type Env = EnvInput & EnvTransformed

declare global {
  const BRANCH: string
  const VERSION: string
  const COMMITHASH: string
  const SENTRY_RELEASE: string
  const ENV: string
}
