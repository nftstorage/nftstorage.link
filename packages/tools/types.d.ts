import { DNSRecordType } from './utils/types'

export interface DeployWebsiteOptions {
  zone: string
  name: string
  type: DNSRecordType
  ttl: number
  proxied: boolean
  email: string
  key: string
  account: string
  project: string
}
