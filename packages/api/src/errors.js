import { HTTP_STATUS_CONFLICT } from './constants.js'

export class InvalidUrlError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'invalid URL') {
    const status = 400
    super(message)
    this.name = 'InvalidUrlError'
    this.status = status
    this.code = InvalidUrlError.CODE
    this.contentType = 'text/html'
  }
}
InvalidUrlError.CODE = 'ERROR_INVALID_URL'

export class ExpectationFailedError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Expectation failed') {
    const status = 417
    super(message)
    this.name = 'ExpectationFailedError'
    this.status = status
    this.code = ExpectationFailedError.CODE
    this.contentType = 'text/html'
  }
}
ExpectationFailedError.CODE = 'ERROR_EXPECTATION_FAILED'

export class TimeoutError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Gateway Time-out') {
    const status = 408
    super(message)
    this.name = 'TimeoutError'
    this.status = status
    this.code = TimeoutError.CODE
    this.contentType = 'text/html'
  }
}
TimeoutError.CODE = 'ERROR_TIMEOUT'

export class InvalidRangeError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'invalid Range') {
    const status = 400
    super(message)
    this.name = 'InvalidRangeError'
    this.status = status
    this.code = InvalidRangeError.CODE
  }
}
InvalidRangeError.CODE = 'ERROR_INVALID_RANGE'

export class HTTPError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} [status]
   */
  constructor(message, status = 500) {
    super(message)
    this.name = 'HTTPError'
    this.status = status
  }
}

export class SuperHotUnauthorizedError extends HTTPError {
  constructor(
    msg = 'Super Hot not authorized for this user, email support@nft.storage to request authorization.'
  ) {
    super(msg, 403)
    this.name = 'SuperHotUnauthorizedError'
    this.code = SuperHotUnauthorizedError.CODE
  }
}
SuperHotUnauthorizedError.CODE = 'ERROR_SUPER_HOT_UNAUTHORIZED'

export class AccountRestrictedError extends HTTPError {
  constructor(
    msg = 'This account is restricted, email support@nft.storage for more information.'
  ) {
    super(msg, 403)
    this.name = 'AccountRestrictedError'
    this.code = AccountRestrictedError.CODE
  }
}
AccountRestrictedError.CODE = 'ERROR_ACCOUNT_RESTRICTED'

export class TokenNotFoundError extends HTTPError {
  constructor(msg = 'API token no longer valid') {
    super(msg, 401)
    this.name = 'TokenNotFound'
    this.code = TokenNotFoundError.CODE
  }
}
TokenNotFoundError.CODE = 'ERROR_TOKEN_NOT_FOUND'

export class UrlNotFoundError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'URL Not Found') {
    super(message)
    this.name = 'UrlNotFoundError'
    this.status = 404
    this.code = UrlNotFoundError.CODE
  }
}
UrlNotFoundError.CODE = 'ERROR_URL_NOT_FOUND'

export class UnrecognisedTokenError extends HTTPError {
  constructor(msg = 'Could not parse provided API token') {
    super(msg, 401)
    this.name = 'UnrecognisedToken'
    this.code = UnrecognisedTokenError.CODE
  }
}
UnrecognisedTokenError.CODE = 'ERROR_UNRECOGNISED_TOKEN'

export class NoTokenError extends HTTPError {
  constructor(msg = 'No token found in `Authorization: Bearer ` header') {
    super(msg, 401)
    this.name = 'NoToken'
    this.code = NoTokenError.CODE
  }
}
NoTokenError.CODE = 'ERROR_NO_TOKEN'

export class DBError extends Error {
  /**
   * @param {{
   *   message: string
   *   details: string
   *   hint: string
   *   code: string
   * }} cause
   */
  constructor({ message, details, hint, code }) {
    super(`${message}, details: ${details}, hint: ${hint}, code: ${code}`)
    this.name = 'DBError'
    this.code = DBError.CODE
  }
}

DBError.CODE = 'ERROR_DB'

export class ConstraintError extends Error {
  /**
   * @param {{
   *   message: string
   *   details?: string
   * }} cause
   */
  constructor({ message, details }) {
    super(`${message}, details: ${details}`)
    this.name = 'ConstraintError'
    this.code = ConstraintError.CODE
    this.status = HTTP_STATUS_CONFLICT
  }
}

ConstraintError.CODE = 'CONSTRAINT_ERROR_DB'
