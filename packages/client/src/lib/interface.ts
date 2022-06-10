export interface Service {
  endpoint: URL
  token: string
  rateLimiter?: RateLimiter
}

/**
 * RateLimiter returns a promise that resolves when it is safe to send a request
 * that does not exceed the rate limit.
 */
export interface RateLimiter {
  (): Promise<void>
}

export interface PutOptions {
  onPut?: (url: string) => void
  maxRetries?: number
}

export interface ListOptions {
  sort?: 'date' | 'size'
  order?: 'asc' | 'desc'
}

export interface DeleteOptions {
  onDelete?: (url: string) => void
  maxRetries?: number
}

export interface CacheEntry {
  url: string
  size: number
  insertedAt: string
}

export interface AccountInfo {
  usedStorage: number;
}

interface CacheSuccess {
  url: string
  size: number
  insertedAt: string
}

interface CacheFailure {
  url: string
  error: string
}

export type CacheResult = CacheSuccess | CacheFailure

interface CacheDeleteSuccess {
  url: string
}

interface CacheDeleteFailure {
  url: string
  error: string
}

export type CacheDeleteResult = CacheDeleteSuccess | CacheDeleteFailure
