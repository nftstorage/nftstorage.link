import test from 'ava'

import { base32 } from 'multiformats/bases/base32'
import { base16 } from 'multiformats/bases/base16'

import { createErrorHtmlContent } from '../src/errors.js'
import { getMiniflare } from './utils.js'

test.beforeEach((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Fails when invalid cid is provided', async (t) => {
  const { mf } = t.context

  const invalidCid = 'bafy'
  const response = await mf.dispatchFetch(
    `https://${invalidCid}.ipfs.localhost:8787`
  )
  t.is(response.status, 400)

  const textResponse = await response.text()
  t.is(
    textResponse,
    createErrorHtmlContent(400, 'invalid CID: bafy: Unexpected end of data')
  )
})

test('Gets content', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.localhost:8787'
  )
  await response.waitUntil()
  t.is(await response.text(), 'Hello nft.storage! 😎')
})

test('Gets content with path', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch(
    'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.localhost:8787/path'
  )
  t.is(await response.text(), 'Hello gateway.nft.storage resource!')
})

test('Gets content with other base encodings', async (t) => {
  const { mf } = t.context

  const cidStr = 'bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq'
  const decodedB32 = base32.decode(cidStr)
  const encodedB16 = base16.encode(decodedB32)

  console.log('encodedB16', encodedB16)

  const response = await mf.dispatchFetch(
    // `https://${encodedB16}.ipfs.localhost:8787`
    'https://f0155122078222a9f806d6805e5a6b94e89b88fb71db71256dc183ecbe84a8ca607ba8f74.ipfs.localhost:8787'
  )
  await response.waitUntil()
  t.is(await response.text(), 'Hello nft.storage! 😎')
})
