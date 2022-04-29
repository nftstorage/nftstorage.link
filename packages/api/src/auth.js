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
 * On successful login, adds `auth.user` to the Request and validates
 * user does not have account restricted and has feature access.
 *
 * @param {import('itty-router').RouteHandler} handler
 * @returns {import('itty-router').RouteHandler}
 */
export function withAuth(handler) {
  /**
   * @param {Request} request
   * @param {import('./env').Env} env
   * @returns {Promise<Response>}
   */
  return async (request, env, ctx) => {
    const token = getTokenFromRequest(request)
    const user = await login(token, env)
    const userTags = await getUserTags(token, env)

    request.auth = {
      user: user,
    }

    env.sentry && env.sentry.setUser(user)

    // Verify user tags
    if (userTags[USER_TAGS.ACCOUNT_RESTRICTION] === true) {
      throw new AccountRestrictedError()
    }
    if (
      !userTags[USER_TAGS.SUPER_HOT_ACCESS] ||
      userTags[USER_TAGS.SUPER_HOT_ACCESS] === false
    ) {
      throw new SuperHotUnauthorizedError()
    }

    return handler(request, env, ctx)
  }
}

/**
 * @param {string} token
 * @param {import('./env').Env} env
 * @throws TokenNotFoundError
 */
async function login(token, env) {
  const res = await fetch(`${env.API}/login`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })

  const body = await res.json()

  if (body.ok) {
    return body.value.user
  } else {
    throw new TokenNotFoundError()
  }
}

/**
 * @param {string} token
 * @param {import('./env').Env} env
 */
async function getUserTags(token, env) {
  const res = await fetch(`${env.API}/user/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })

  const body = await res.json()
  if (body.ok) {
    return body.value
  } else {
    throw new UnrecognisedTokenError()
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
