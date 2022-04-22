import { concat } from 'uint8arrays/concat'

export function createR2Bucket() {
  const datastore = new Map()

  return {
    put: async (key, value, putOpts) => {
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

      // TODO: Store metadata
      datastore.set(key, data)

      return Promise.resolve()
    },
    get: async (key, options) => {
      const value = datastore.get(key)

      return Promise.resolve(new Response(value, { status: 200 }))
    },
  }
}
