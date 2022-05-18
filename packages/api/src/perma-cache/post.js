/* eslint-env serviceworker, browser */
/* global Response */

import { HTTPError } from '../errors.js'
import { JSONResponse } from '../utils/json-response.js'
import { encodeKey, getSourceUrl, getNormalizedUrl } from './utils.js'

import { gatewayIpfs } from 'edge-gateway/src/gateway.js'

/**
 * @typedef {import('../env').Env} Env
 * @typedef {{ userId: string, r2Key: string, date: string }} Key
 *
 * @typedef {Object} IpfsUrlParts
 * @property {string} cid
 * @property {string} url
 * @property {string} path
 */

/**
 * Handle perma-cache post request
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('..').Ctx} ctx
 */
export async function permaCachePost(request, env, ctx) {
  const sourceUrl = getSourceUrl(request, env)
  const normalizedUrl = getNormalizedUrl(sourceUrl, env)
  const r2Key = normalizedUrl.toString()
  const userId = request.auth.user.id

  // Checking if existent does not protect us of concurrent perma cache
  // but avoids downloading content to fail later.
  const existing = await env.db.getPermaCache(userId, normalizedUrl.toString())
  if (existing) {
    throw new HTTPError('The provided URL was already perma cached', 400)
  }

  // Lock URL
  const kvKey = encodeKey(r2Key, userId)
  await env.PERMACACHE_LOCK.put(kvKey, new Date().toISOString())

  // Validate if we already have it in R2
  let r2Object
  try {
    r2Object = await env.SUPERHOT.head(normalizedUrl.toString())
  } catch (err) {
    // TODO: R2 currently throws error here and does not follow types to return undefined.
    // They say it will change soon to return undefined...
    console.log(err)
  }

  if (!r2Object) {
    // Fetch Response from provided URL
    const response = await getResponse(request, env, ctx, normalizedUrl)
    if (!response.ok) {
      // Unlock URL
      await env.PERMACACHE_LOCK.delete(kvKey)

      throw new HTTPError(
        'Failed to get response from provided URL',
        response.status
      )
    }

    // TODO: Validate headers per https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    // Store in R2 and add to Database if not existent
    r2Object = await env.SUPERHOT.put(r2Key, response.body, {
      httpMetadata: response.headers,
    })
  }

  // Will fail on concurrent perma cache of pair (userId, url)
  const data = await env.db.createPermaCache({
    userId,
    sourceUrl: sourceUrl.toString(),
    normalizedUrl: normalizedUrl.toString(),
    size: r2Object.size,
  })

  // Unlock URL
  await env.PERMACACHE_LOCK.delete(kvKey)

  return new JSONResponse({
    url: sourceUrl.toString(),
    size: r2Object.size,
    insertedAt: data,
  })
}

/**
 * Fetch Response from provided URL.
 * @param {Request} request
 * @param {Env} env
 * @param {import('..').Ctx} ctx
 * @param {URL} url
 */
async function getResponse(request, env, ctx, url) {
  // TODO: Wait for CF services support
  /*
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), env.REQUEST_TIMEOUT)
  let response
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: getHeaders(request),
    })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new TimeoutError()
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
  return response
  */

  request = new Request(url.toString())

  // @ts-ignore Env does not match entirely
  return await gatewayIpfs(request, env, ctx)
}

/**
 * @param {Request} request
 */
function getHeaders(request) {
  const existingProxies = request.headers.get('X-Forwarded-For')
    ? `, ${request.headers.get('X-Forwarded-For')}`
    : ''
  return {
    'X-Forwarded-For': `${request.headers.get(
      'cf-connecting-ip'
    )}${existingProxies}`,
  }
}
