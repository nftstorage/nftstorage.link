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
  onPutUrl?: (url: string) => void
  maxRetries?: number
}

export interface ListOptions {
  sort?: 'date' | 'size'
  order?: 'asc' | 'desc'
}

export interface DeleteOptions {
  onDeleteUrl?: (url: string) => void
  maxRetries?: number
}

export interface PermaCacheEntry {
  url: string,
  size: number,
  insertedAt: string,
}

export interface PermaCacheDeletedEntry {
  url: string,
  success: boolean,
}

export interface PermaCacheStatus {
  usedStorage: number;
}
