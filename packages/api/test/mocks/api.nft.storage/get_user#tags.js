const USER_WITH_ACCOUNT_RESTRICTED = 'USER_WITH_ACCOUNT_RESTRICTED'
const USER_WITHOUT_SUPER_HOT_ACCESS = 'USER_WITHOUT_SUPER_HOT_ACCESS'

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
  const token = authHeader.substring(7)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      ok: true,
      value: {
        HasAccountRestriction: token === USER_WITH_ACCOUNT_RESTRICTED,
        HasSuperHotAccess: token !== USER_WITHOUT_SUPER_HOT_ACCESS,
      },
    },
  }
}
