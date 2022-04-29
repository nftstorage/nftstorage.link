const validTokens = [1, 2, 3]

/**
 * https://github.com/sinedied/smoke#javascript-mocks
 */
module.exports = ({ headers }) => {
  const authHeader = headers['authorization'] || ''
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return {
      statusCode: 500,
      body: {
        ok: false,
      },
    }
  }

  const token = Number(authHeader.substring(7))

  // Not a valid user
  if (!validTokens.includes(token)) {
    return {
      statusCode: 500,
      body: {
        ok: false,
      },
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      ok: true,
      value: {
        user: {
          id: token,
        },
      },
    },
  }
}
