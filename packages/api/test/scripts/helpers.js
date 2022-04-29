/**
 * @param {Object} [options]
 * @param {boolean} [options.hasAccountRestriction]
 * @param {boolean} [options.hasSuperHotAccess = true]
 */
export async function createTestUser({
  hasAccountRestriction = false,
  hasSuperHotAccess = true,
} = {}) {
  if (hasAccountRestriction) {
    return USER_WITH_ACCOUNT_RESTRICTED
  }

  if (!hasSuperHotAccess) {
    return USER_WITHOUT_SUPER_HOT_ACCESS
  }

  return USER_WITH_SUPER_HOT_ACCESS
}

export const USER_WITH_SUPER_HOT_ACCESS = {
  id: 1,
  token: 1,
}
export const USER_WITHOUT_SUPER_HOT_ACCESS = {
  id: 2,
  token: 2,
}
export const USER_WITH_ACCOUNT_RESTRICTED = {
  id: 3,
  token: 3,
}
