const FAR_FUTURE = new Date('3000-01-01T00:00:00.000Z').getTime()
const PAD_LEN = FAR_FUTURE.toString().length

/**
 * @typedef {{ userId: string, r2Key: string, date: string }} Key
 */

/**
 * Encode key with user namespace to handle concurrency and keeping track of all
 * @param {Key} key
 */
export function encodeKey({ userId, r2Key, date }) {
  const createdTime = new Date(date).getTime()
  const ts = (FAR_FUTURE - createdTime).toString().padStart(PAD_LEN, '0')

  return `${userId}:${encodeURIComponent(r2Key)}:${ts}`
}

/**
 * @param {string} key
 * @returns {Key}
 */
export function decodeKey(key) {
  const parts = key.split(':')
  const ts = parts.pop()
  const r2Key = decodeURIComponent(parts.pop())
  if (!r2Key || !ts) throw new Error('Invalid key')
  const date = new Date(FAR_FUTURE - parseInt(ts)).toISOString()

  return { date, r2Key, userId: parts.join(':') }
}
