export const JWT_ISSUER = 'nft-storage'
export const USER_TAGS = {
  ACCOUNT_RESTRICTION: 'HasAccountRestriction',
  SUPER_HOT_ACCESS: 'HasSuperHotAccess',
}
export const FAR_FUTURE = new Date('3000-01-01T00:00:00.000Z').getTime()
export const PAD_LEN = FAR_FUTURE.toString().length

// KV maximum length is 512 bytes - we need to store space for user ID and timestamp
export const MAX_ALLOWED_URL_LENGTH = 460
