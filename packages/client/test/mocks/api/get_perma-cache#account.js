module.exports = ({ headers }) => {
  if (!headers.authorization || headers.authorization === 'Bearer bad') {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/json' },
      body: {
        message: 'Permission denied',
      },
    }
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/json' },
    body: {
      usedStorage: 1000,
    },
  }
}
