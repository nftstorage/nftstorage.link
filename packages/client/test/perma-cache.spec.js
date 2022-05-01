/* eslint-env mocha */
import assert from 'assert'
import { PermaCache } from '../src/lib.js'

describe('perma-cache client', () => {
  const { AUTH_TOKEN, API_PORT } = process.env
  const token = AUTH_TOKEN || 'good'
  const endpoint = new URL(API_PORT ? `http://localhost:${API_PORT}` : '')

  it('interface', () => {
    assert.strictEqual(typeof PermaCache, 'function')
    const client = new PermaCache({ token: 'secret' })
    assert.ok(client instanceof PermaCache)
    assert.strictEqual(typeof client.put, 'function')
    assert.strictEqual(typeof client.list, 'function')
    assert.strictEqual(typeof client.status, 'function')
    assert.strictEqual(typeof client.delete, 'function')

    assert.strictEqual(typeof PermaCache.put, 'function')
    assert.strictEqual(typeof PermaCache.list, 'function')
    assert.strictEqual(typeof PermaCache.status, 'function')
    assert.strictEqual(typeof PermaCache.delete, 'function')
  })

  describe('status', () => {
    it('returns the account status', async () => {
      const client = new PermaCache({ token, endpoint })
      const status = await client.status()

      assert.ok(status)
      assert.ok(status.usedStorage)
      assert.strictEqual(status.usedStorage, 1000)
    })

    it('handles error messages', async () => {
      const client = new PermaCache({ token: 'bad', endpoint })

      try {
        await client.status()
        throw new Error('should have thrown')
      } catch (err) {
        assert.strictEqual(err.message, 'Permission denied')
      }
    })
  })

  describe('put', () => {
    it('can perma cache URLs', async () => {
      const urls = [
        'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
        'https://nftstorage.link/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
      ]
      const client = new PermaCache({ token, endpoint })
      const permaCacheEntries = await client.put(urls, {
        onPutUrl: (url) => {
          assert.ok(urls.includes(url))
        },
      })

      assert.ok(permaCacheEntries)
      assert.strictEqual(permaCacheEntries.length, urls.length)

      permaCacheEntries.map((entry) => {
        assert.strictEqual(entry.isFulfilled, true)
        assert.strictEqual(entry.isRejected, false)
        assert.ok(urls.includes(entry.value.url))
        assert.ok(entry.value.size)
        assert.ok(entry.value.insertedAt)
      })
    })

    it('can validate URLs', async () => {
      const urls = [
        'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.nftstorage.link',
      ]
      const client = new PermaCache({ token, endpoint })

      try {
        await client.put(urls)
        throw new Error('should have thrown')
      } catch (err) {
        assert.strictEqual(
          err.message,
          'One or more urls are not nftstorage.link IPFS URLs'
        )
      }
    })

    it('aborts retries on authentication and authorization errors', async () => {
      const urls = [
        'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
        'https://nftstorage.link/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
      ]
      const client = new PermaCache({ token: 'bad', endpoint })
      const permaCacheEntries = await client.put(urls, {
        onPutUrl: () => {
          throw new Error('Should not put any URL in cache')
        },
      })

      assert.ok(permaCacheEntries)
      assert.strictEqual(permaCacheEntries.length, urls.length)
      assert.strictEqual(
        permaCacheEntries.filter((e) => e.isRejected).length,
        2
      )
      assert.strictEqual(
        permaCacheEntries.filter(
          (e) => e.reason.message === 'Permission denied'
        ).length,
        2
      )
    })
  })

  describe('delete', () => {
    it('deletes perma cached urls given', async () => {
      const urls = [
        'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
        'https://nftstorage.link/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
      ]
      const client = new PermaCache({ token, endpoint })
      const permaCacheDeletedEntries = await client.delete(urls, {
        onDeleteUrl: (url) => {
          assert.ok(urls.includes(url))
        },
      })

      assert.ok(permaCacheDeletedEntries)
      assert.strictEqual(permaCacheDeletedEntries.length, urls.length)

      permaCacheDeletedEntries.map((entry) => {
        assert.strictEqual(entry.isFulfilled, true)
        assert.strictEqual(entry.isRejected, false)
        assert.ok(urls.includes(entry.value.url))
        assert.ok(entry.value.success)
      })
    })

    it('can validate URLs', async () => {
      const urls = [
        'https://nftstorage.link/notipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
      ]
      const client = new PermaCache({ token, endpoint })

      try {
        await client.delete(urls)
        throw new Error('should have thrown')
      } catch (err) {
        assert.strictEqual(
          err.message,
          'One or more urls are not nftstorage.link IPFS URLs'
        )
      }
    })

    it('aborts retries on authentication and authorization errors', async () => {
      const urls = [
        'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
        'https://nftstorage.link/ipfs/bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq/path',
      ]
      const client = new PermaCache({ token: 'bad', endpoint })
      const permaCacheDeletedEntries = await client.delete(urls, {
        onDeleteUrl: () => {
          throw new Error('Should not put any URL in cache')
        },
      })

      assert.ok(permaCacheDeletedEntries)
      assert.strictEqual(permaCacheDeletedEntries.length, urls.length)
      assert.strictEqual(
        permaCacheDeletedEntries.filter((e) => e.isRejected).length,
        2
      )
      assert.strictEqual(
        permaCacheDeletedEntries.filter(
          (e) => e.reason.message === 'Permission denied'
        ).length,
        2
      )
    })
  })

  describe('list', () => {
    it('list user perma cached urls', async () => {
      const client = new PermaCache({ token, endpoint })
      const permaCacheEntries = []

      for await (const entry of client.list()) {
        permaCacheEntries.push(entry)
      }

      assert.ok(permaCacheEntries)
      assert.ok(permaCacheEntries.length > 1)
    })

    it('handles error messages', async () => {
      const client = new PermaCache({ token: 'bad', endpoint })

      try {
        for await (const _ of client.list()) {
        }
        throw new Error('should have thrown')
      } catch (err) {
        assert.strictEqual(err.message, 'Permission denied')
      }
    })
  })
})
