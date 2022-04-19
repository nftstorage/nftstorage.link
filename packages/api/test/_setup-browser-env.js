// Per https://github.com/avajs/ava/blob/main/docs/recipes/browser-testing.md

// Add web crypto to support jwt
import { webcrypto } from 'crypto'

// @ts-ignore webcrypto does not have all the types
global.crypto = webcrypto
