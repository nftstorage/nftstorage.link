// Per https://github.com/avajs/ava/blob/main/docs/recipes/browser-testing.md

import browserEnv from 'browser-env'
browserEnv()

// Add web response for R2 mocking
import { Response } from '@web-std/fetch'

// @ts-ignore response does not have all the types
global.Response = Response
