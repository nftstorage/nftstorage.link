import { concat } from 'uint8arrays/concat'

export function createR2Bucket() {
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

      // TODO: Store metadata
      bucket.set(key, {
        body: data,
        httpMetadata: putOpts.httpMetadata || {},
        customMetadata: putOpts.customMetadata || {},
      })

      return Promise.resolve({
        httpMetadata: putOpts.httpMetadata,
        customMetadata: putOpts.customMetadata,
        size: data.length,
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
          size: value.body.length,
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
        size: value.body.length,
      })
    },
  }
}
