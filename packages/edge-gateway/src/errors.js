export class InvalidUrlError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'invalid URL') {
    const status = 400
    super(createErrorHtmlContent(status, message))
    this.name = 'InvalidUrlError'
    this.status = status
    this.code = InvalidUrlError.CODE
    this.contentType = 'text/html'
  }
}
InvalidUrlError.CODE = 'ERROR_INVALID_URL'

export class TimeoutError extends Error {
  /**
   * @param {string} message
   */
  constructor(message = 'Gateway Time-out') {
    const status = 408
    super(createErrorHtmlContent(status, message))
    this.name = 'TimeoutError'
    this.status = status
    this.code = TimeoutError.CODE
    this.contentType = 'text/html'
  }
}
TimeoutError.CODE = 'ERROR_TIMEOUT'

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

export class UserNotFoundError extends HTTPError {
  constructor(msg = 'No user found for user token') {
    super(msg, 401)
    this.name = 'UserNotFound'
    this.code = UserNotFoundError.CODE
  }
}
UserNotFoundError.CODE = 'ERROR_USER_NOT_FOUND'

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

export const createErrorHtmlContent = (status, message) => `<html>
<head><title>${status} ${message}</title></head>
<body>
<div style="text-align:center">
<h1>${status} ${message}</h1>
</div>
</body>
</html>
`
