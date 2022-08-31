import { createErrorHtmlContent } from '../src/errors.js'
import { test, getMiniflare } from './utils/setup.js'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Fails when invalid name with IPNS canonical resolution', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://localhost:8787/ipns/en.super-long-name-on-ipfs-exceeding-limit-from-ietf-rfc1034.org'
  )
  t.is(response.status, 400)

  const textResponse = await response.text()
  t.is(
    textResponse,
    createErrorHtmlContent(
      400,
      'invalid FQDN: en.super-long-name-on-ipfs-exceeding-limit-from-ietf-rfc1034.org: longer than max length: 63'
    )
  )
})

test('should redirect to subdomain with IPNS canonical resolution', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://localhost:8787/ipns/en.wikipedia-on-ipfs.org'
  )
  await response.waitUntil()
  t.is(response.status, 302)
  t.is(
    response.headers.get('location'),
    'https://en-wikipedia--on--ipfs-org.ipns.localhost:8787/'
  )
})

test('should redirect to subdomain with IPNS canonical resolution keeping path and query params', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://localhost:8787/ipns/en.wikipedia-on-ipfs.org/Energy?key=value'
  )
  await response.waitUntil()
  t.is(response.status, 302)
  t.is(
    response.headers.get('location'),
    'https://en-wikipedia--on--ipfs-org.ipns.localhost:8787/Energy?key=value'
  )
})

test('should redirect to dweb.link with IPNS subdomain resolution', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://en-wikipedia--on--ipfs-org.ipns.localhost:8787/Energy?key=value'
  )
  await response.waitUntil()
  t.is(response.status, 302)
  t.is(
    response.headers.get('location'),
    'https://en-wikipedia--on--ipfs-org.ipns.dweb.link/Energy?key=value'
  )
})
