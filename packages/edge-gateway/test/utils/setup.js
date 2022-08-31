import anyTest from 'ava'
export * from './miniflare.js'

/**
 * @typedef {import('miniflare').Miniflare} Miniflare
 *
 * @typedef {Object} Context
 * @property {Miniflare} mf
 *
 * @typedef {import('ava').TestInterface<Context>} TestFn
 */

export const test = /** @type {TestFn} */ (anyTest)
