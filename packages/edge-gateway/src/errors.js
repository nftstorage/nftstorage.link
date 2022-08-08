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

export const createErrorHtmlContent = (
  /** @type {number} */ status,
  /** @type {string} */ message
) => `<html>
<head><title>${status} ${message}</title></head>
<body>
<div style="text-align:center">
<h1>${status} ${message}</h1>
</div>
</body>
</html>
`
