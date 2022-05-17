import * as JWT from './utils/jwt.js'
import {
  AccountRestrictedError,
  NoTokenError,
  SuperHotUnauthorizedError,
  TokenNotFoundError,
  UnrecognisedTokenError,
} from './errors.js'
import { USER_TAGS } from './constants.js'

/**
 * Middleware: verify the request is authenticated with a valid api token.
 * On successful login, adds `auth.user`, `auth.authToken`, and `auth.userTags` to the Request
 *
 * @param {import('itty-router').RouteHandler} handler
 * @returns {import('itty-router').RouteHandler}
 */
export function withApiToken(handler) {
  /**
   * @param {Request} request
   * @param {import('./env').Env} env
   * @returns {Promise<Response>}
   */
  return async (request, env, ctx) => {
    const token = getTokenFromRequest(request, env)
    const apiToken = await tryApiToken(token, env)
    if (apiToken) {
      const userTags = await env.db.getUserTags(apiToken.user.id)
      request.auth = {
        user: apiToken.user,
        userTags,
      }
      env.sentry && env.sentry.setUser(apiToken.user)
      return handler(request, env, ctx)
    }

    throw new UnrecognisedTokenError()
  }
}

/**
 * Middleware: verify that the authenticated request is for a user whose
 * account is not restricted.
 *
 * @param {import('itty-router').RouteHandler} handler
 * @returns {import('itty-router').RouteHandler}
 */
export function withAccountNotRestricted(handler) {
  return async (request, env, ctx) => {
    const isAccountRestricted = request.auth.userTags.find(
      (v) => v.tag === USER_TAGS.ACCOUNT_RESTRICTION && v.value === 'true'
    )
    if (!isAccountRestricted) {
      return handler(request, env, ctx)
    }
    throw new AccountRestrictedError()
  }
}

/**
 * Middleware: verify that the authenticated request is for a user who is
 * authorized to use super hot.
 *
 * @param {import('itty-router').RouteHandler} handler
 * @returns {import('itty-router').RouteHandler}
 */
export function withSuperHotAuthorized(handler) {
  return async (request, env, ctx) => {
    const authorized = request.auth.userTags.find(
      (v) => v.tag === USER_TAGS.SUPER_HOT_ACCESS && v.value === 'true'
    )
    if (authorized) {
      return handler(request, env, ctx)
    }
    throw new SuperHotUnauthorizedError()
  }
}

/**
 * @param {string} token
 * @param {import('./env').Env}
 * @throws TokenNotFoundError
 */
async function tryApiToken(token, env) {
  let decoded = null
  try {
    await JWT.verify(token, env.SALT)
    decoded = JWT.parse(token)
  } catch (_) {
    // not a api token
    return null
  }
  const user = await env.db.getUser(decoded.sub)
  if (!user) {
    // we have a api token, but it's no longer valid
    throw new TokenNotFoundError()
  }

  return {
    user: user,
  }
}

/**
 * @param {Request} request
 * @throws NoTokenError
 */
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('Authorization') || ''
  if (!authHeader) {
    throw new NoTokenError()
  }

  const token = parseAuthorizationHeader(authHeader)
  if (!token) {
    throw new NoTokenError()
  }
  return token
}

/**
 * Parse a raw DID Token from the given Authorization header.
 * @param {string} header
 */
function parseAuthorizationHeader(header) {
  if (!header.toLowerCase().startsWith('bearer ')) {
    throw new UnrecognisedTokenError(
      'Expected argument to be a string in the `Bearer {token}` format.'
    )
  }
  return header.substring(7)
}
