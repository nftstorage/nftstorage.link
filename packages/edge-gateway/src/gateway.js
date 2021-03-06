/* eslint-env serviceworker, browser */
/* global Response caches */

import pAny, { AggregateError } from 'p-any'
import { FilterError } from 'p-some'
import pSettle from 'p-settle'
import pRetry from 'p-retry'

import { TimeoutError } from './errors.js'
import { getCidFromSubdomainUrl } from './utils/cid.js'
import { toDenyListAnchor } from './utils/deny-list.js'
import {
  CIDS_TRACKER_ID,
  SUMMARY_METRICS_ID,
  REDIRECT_COUNTER_METRICS_ID,
  CF_CACHE_MAX_OBJECT_SIZE,
  HTTP_STATUS_RATE_LIMITED,
  REQUEST_PREVENTED_RATE_LIMIT_CODE,
  TIMEOUT_CODE,
} from './constants.js'

/**
 * @typedef {Object} GatewayResponse
 * @property {Response} [response]
 * @property {string} url
 * @property {number} [responseTime]
 * @property {string} [reason]
 * @property {boolean} [aborted]
 *
 * @typedef {import('./env').Env} Env
 * @typedef {import('p-settle').PromiseResult<GatewayResponse>} PromiseResultGatewayResponse
 *
 * @typedef {Object} IPFSResolutionOptions
 * @property {(response: Response, responseTime: number) => void} [onCdnResolution]
 * @property {(winnerGwResponse: GatewayResponse, gatewayReqs: Promise<GatewayResponse>[], cid: string) => void} [onRaceResolution]
 * @property {(gwResponses: PromiseResultGatewayResponse[], wasRateLimited: boolean) => void} [onRaceError]
 */

/**
 * Handle gateway request
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('./index').Ctx} ctx
 */
export async function gatewayGet(request, env, ctx) {
  // Redirect if ipns
  if (request.url.includes(env.IPNS_GATEWAY_HOSTNAME)) {
    return Response.redirect(
      request.url.replace(env.IPNS_GATEWAY_HOSTNAME, 'ipns.dweb.link'),
      302
    )
  }

  return await gatewayIpfs(request, env, ctx, {
    onCdnResolution: (res, responseTime) => {
      ctx.waitUntil(updateSummaryCacheMetrics(request, env, res, responseTime))
    },
    onRaceResolution: (winnerGwResponse, gatewayReqs, cid) => {
      ctx.waitUntil(
        (async () => {
          await Promise.all([
            storeWinnerGwResponse(request, env, winnerGwResponse),
            settleGatewayRequests(
              request,
              env,
              gatewayReqs,
              winnerGwResponse.url,
              cid
            ),
          ])
        })()
      )
    },
    onRaceError: (gwResponses, wasRateLimited) => {
      ctx.waitUntil(
        (async () => {
          // Update metrics as all requests failed
          await Promise.all(
            gwResponses.map((r) =>
              updateGatewayMetrics(request, env, r.value, false)
            )
          )
          wasRateLimited && updateGatewayRedirectCounter(request, env)
        })()
      )
    },
  })
}

/**
 * Perform edge gateway IPFS content resolution.
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('./index').Ctx} ctx
 * @param {IPFSResolutionOptions} [options]
 */
export async function gatewayIpfs(request, env, ctx, options = {}) {
  const startTs = Date.now()
  const reqUrl = new URL(request.url)
  const cid = getCidFromSubdomainUrl(reqUrl)
  const pathname = reqUrl.pathname

  // Validation layer - root CID
  const denyListRootCidEntry = await getFromDenyList(env, cid)
  if (denyListRootCidEntry) {
    const { status, reason } = JSON.parse(denyListRootCidEntry)
    return new Response(reason || '', { status: status || 410 })
  }

  // 1st layer resolution - CDN
  const cache = caches.default
  const res = await cdnResolution(request, env, cache)
  if (res) {
    // Update cache metrics in background
    const responseTime = Date.now() - startTs

    options.onCdnResolution && options.onCdnResolution(res, responseTime)
    return res
  } else if (
    (request.headers.get('Cache-Control') || '').includes('only-if-cached')
  ) {
    throw new TimeoutError()
  }

  // 2nd layer resolution - Public Gateways race
  const gatewayReqs = env.ipfsGateways.map((gwUrl) =>
    gatewayFetch(gwUrl, cid, request, {
      pathname,
      timeout: env.REQUEST_TIMEOUT,
    })
  )

  try {
    /** @type {GatewayResponse} */
    const winnerGwResponse = await pAny(gatewayReqs, {
      filter: (res) => res.response?.ok,
    })

    // Validation layer - resource CID
    if (pathname !== '/') {
      const resourceCid = decodeURIComponent(
        winnerGwResponse.response.headers.get('etag')
      )
      const denyListResource = await getFromDenyList(env, resourceCid)
      if (denyListResource) {
        const { status, reason } = JSON.parse(denyListResource)
        return new Response(reason || '', { status: status || 410 })
      }
    }

    options.onRaceResolution &&
      options.onRaceResolution(winnerGwResponse, gatewayReqs, cid)
    // Cache response
    ctx.waitUntil(
      (async () => {
        const contentLengthMb = Number(
          winnerGwResponse.response.headers.get('content-length')
        )

        // Cache request URL in Cloudflare CDN if smaller than CF_CACHE_MAX_OBJECT_SIZE
        if (contentLengthMb <= CF_CACHE_MAX_OBJECT_SIZE) {
          await cache.put(request.url, winnerGwResponse.response.clone())
        }
      })()
    )

    // forward winner gateway response
    return winnerGwResponse.response
  } catch (err) {
    const responses = await pSettle(gatewayReqs)

    // Redirect if all failed with rate limited error
    const wasRateLimited = responses.every(
      (r) =>
        r.value?.response?.status === HTTP_STATUS_RATE_LIMITED ||
        r.value?.reason === REQUEST_PREVENTED_RATE_LIMIT_CODE
    )

    options.onRaceError && options.onRaceError(responses, wasRateLimited)

    if (wasRateLimited) {
      const ipfsUrl = new URL('ipfs', env.ipfsGateways[0])
      return Response.redirect(`${ipfsUrl.toString()}/${cid}${pathname}`, 302)
    }

    // Return the error response from gateway, error is not from nft.storage Gateway
    if (err instanceof FilterError || err instanceof AggregateError) {
      const candidateResponse = responses.find((r) => r.value?.response)

      // Return first response with upstream error
      if (candidateResponse) {
        return candidateResponse.value?.response
      }

      // Gateway timeout
      if (
        responses[0].value?.aborted &&
        responses[0].value?.reason === TIMEOUT_CODE
      ) {
        throw new TimeoutError()
      }
    }

    throw err
  }
}

/**
 * Get a given entry from the deny list if CID exists.
 *
 * @param {Env} env
 * @param {string} cid
 */
async function getFromDenyList(env, cid) {
  if (!env.DENYLIST) {
    return undefined
  }

  const anchor = await toDenyListAnchor(cid)
  // TODO: Remove once https://github.com/nftstorage/nftstorage.link/issues/51 is fixed
  return await pRetry(
    // TODO: in theory we should check each subcomponent of the pathname also.
    // https://github.com/nftstorage/nft.storage/issues/1737
    () => env.DENYLIST.get(anchor),
    { retries: 5 }
  )
}

/**
 * Settle all gateway requests and update metrics.
 *
 * @param {Request} request
 * @param {Env} env
 * @param {Promise<GatewayResponse>[]} gatewayReqs
 * @param {string} winnerUrl
 * @param {string} cid
 */
async function settleGatewayRequests(
  request,
  env,
  gatewayReqs,
  winnerUrl,
  cid
) {
  // Wait for remaining responses
  const responses = await pSettle(gatewayReqs)
  const successFullResponses = responses.filter((r) => r.value?.response?.ok)

  await Promise.all([
    // Filter out winner and update remaining gateway metrics
    ...responses
      .filter((r) => r.value?.url !== winnerUrl)
      .map((r) => updateGatewayMetrics(request, env, r.value, false)),
    updateCidsTracker(request, env, successFullResponses, cid),
  ])
}

/**
 * CDN url resolution.
 *
 * @param {Request} request
 * @param {Env} env
 * @param {Cache} cache
 */
async function cdnResolution(request, env, cache) {
  // Should skip cache if instructed by headers
  if ((request.headers.get('Cache-Control') || '').includes('no-cache')) {
    return undefined
  }

  try {
    const res = await pAny(
      [cache.match(request.url), getFromPermaCache(request, env)],
      {
        filter: (res) => !!res,
      }
    )
    return res
  } catch (err) {
    if (err instanceof FilterError || err instanceof AggregateError) {
      return undefined
    }
    throw err
  }
}

/**
 * Get from Perma Cache route.
 *
 * @param {Request} request
 * @param {Env} env
 * @return {Promise<Response|undefined>}
 */
async function getFromPermaCache(request, env) {
  const req = await env.API.fetch(
    new URL(
      `/perma-cache/${encodeURIComponent(request.url)}`,
      env.EDGE_GATEWAY_API_URL
    ).toString(),
    {
      headers: request.headers,
    }
  )
  if (req.ok) {
    return req
  }

  return undefined
}

/**
 * Store metrics for winner gateway response
 *
 * @param {Request} request
 * @param {Env} env
 * @param {GatewayResponse} winnerGwResponse
 */
async function storeWinnerGwResponse(request, env, winnerGwResponse) {
  await Promise.all([
    updateGatewayMetrics(request, env, winnerGwResponse, true),
    updateSummaryWinnerMetrics(request, env, winnerGwResponse),
  ])
}

/**
 * Fetches given CID from given IPFS gateway URL.
 *
 * @param {string} gwUrl
 * @param {string} cid
 * @param {Request} request
 * @param {Object} [options]
 * @param {string} [options.pathname]
 * @param {number} [options.timeout]
 */
async function gatewayFetch(
  gwUrl,
  cid,
  request,
  { pathname = '', timeout = 60000 } = {}
) {
  const ipfsUrl = new URL('ipfs', gwUrl)
  const controller = new AbortController()
  const startTs = Date.now()
  const timer = setTimeout(() => controller.abort(), timeout)

  let response
  try {
    response = await fetch(`${ipfsUrl.toString()}/${cid}${pathname}`, {
      signal: controller.signal,
      headers: getHeaders(request),
    })
  } catch (error) {
    if (controller.signal.aborted) {
      return {
        url: gwUrl,
        aborted: true,
        reason: TIMEOUT_CODE,
      }
    }
    throw error
  } finally {
    clearTimeout(timer)
  }

  /** @type {GatewayResponse} */
  const gwResponse = {
    response,
    url: gwUrl,
    responseTime: Date.now() - startTs,
  }
  return gwResponse
}

/**
 * @param {Request} request
 */
function getHeaders(request) {
  // keep headers
  const headers = cloneHeaders(request.headers)
  const existingProxies = headers.get('X-Forwarded-For')
    ? `, ${headers.get('X-Forwarded-For')}`
    : ''

  headers.set(
    'X-Forwarded-For',
    `${headers.get('cf-connecting-ip')}${existingProxies}`
  )
  headers.set('X-Forwarded-Host', headers.get('host') || '')

  return headers
}

/**
 * Clone headers to mutate them.
 *
 * @param {Headers} reqHeaders
 */
function cloneHeaders(reqHeaders) {
  const headers = new Headers()
  for (var kv of reqHeaders.entries()) {
    headers.append(kv[0], kv[1])
  }
  return headers
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {Response} response
 * @param {number} responseTime
 */
async function updateSummaryCacheMetrics(request, env, response, responseTime) {
  // Get durable object for summary
  const id = env.summaryMetricsDurable.idFromName(SUMMARY_METRICS_ID)
  const stub = env.summaryMetricsDurable.get(id)

  /** @type {import('./durable-objects/summary-metrics').FetchStats} */
  const contentLengthStats = {
    contentLength: Number(response.headers.get('content-length')),
    responseTime,
  }

  await stub.fetch(
    getDurableRequestUrl(request, 'metrics/cache', contentLengthStats)
  )
}
/**
 * @param {Request} request
 * @param {import('./env').Env} env
 */
async function updateGatewayRedirectCounter(request, env) {
  // Get durable object for counter
  const id = env.gatewayRedirectCounter.idFromName(REDIRECT_COUNTER_METRICS_ID)
  const stub = env.gatewayRedirectCounter.get(id)

  await stub.fetch(getDurableRequestUrl(request, 'update'))
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {GatewayResponse} gwResponse
 */
async function updateSummaryWinnerMetrics(request, env, gwResponse) {
  // Get durable object for gateway
  const id = env.summaryMetricsDurable.idFromName(SUMMARY_METRICS_ID)
  const stub = env.summaryMetricsDurable.get(id)

  /** @type {import('./durable-objects/summary-metrics').FetchStats} */
  const fetchStats = {
    responseTime: gwResponse.responseTime,
    contentLength: Number(gwResponse.response.headers.get('content-length')),
  }

  await stub.fetch(getDurableRequestUrl(request, 'metrics/winner', fetchStats))
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {GatewayResponse} gwResponse
 * @param {boolean} [isWinner = false]
 */
async function updateGatewayMetrics(
  request,
  env,
  gwResponse,
  isWinner = false
) {
  // Get durable object for gateway
  const id = env.gatewayMetricsDurable.idFromName(gwResponse.url)
  const stub = env.gatewayMetricsDurable.get(id)

  /** @type {import('./durable-objects/gateway-metrics').FetchStats} */
  const fetchStats = {
    status: gwResponse.response?.status,
    winner: isWinner,
    responseTime: gwResponse.responseTime,
    requestPreventedCode: gwResponse.reason,
  }

  await stub.fetch(getDurableRequestUrl(request, 'update', fetchStats))
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {import('p-settle').PromiseResult<GatewayResponse>[]} responses
 * @param {string} cid
 */
async function updateCidsTracker(request, env, responses, cid) {
  const id = env.cidsTrackerDurable.idFromName(CIDS_TRACKER_ID)
  const stub = env.cidsTrackerDurable.get(id)

  /** @type {import('./durable-objects/cids').CidUpdateRequest} */
  const updateRequest = {
    cid,
    urls: responses.filter((r) => r.isFulfilled).map((r) => r?.value?.url),
  }

  await stub.fetch(getDurableRequestUrl(request, 'update', updateRequest))
}

/**
 * Get a Request to update a durable object
 *
 * @param {Request} request
 * @param {string} route
 * @param {any} [data]
 */
function getDurableRequestUrl(request, route, data) {
  const reqUrl = new URL(request.url)
  const durableReqUrl = new URL(route, `${reqUrl.protocol}//${reqUrl.host}`)
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return new Request(durableReqUrl.toString(), {
    headers,
    method: 'PUT',
    body: data && JSON.stringify(data),
  })
}
