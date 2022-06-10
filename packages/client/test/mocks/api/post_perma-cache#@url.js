/**
 * @param {*} request
 */
module.exports = ({ headers, params }) => {
  if (!headers.authorization || headers.authorization === 'Bearer bad') {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/json' },
      body: {
        message: 'Permission denied',
      },
    }
  }

  const { url } = params

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/json' },
    body: {
      url: decodeURIComponent(url),
      size: 1000,
      insertedAt: new Date().toISOString(),
    },
  }
}
