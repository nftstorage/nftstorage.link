import test from 'ava'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import git from 'git-rev-sync'

import { getMiniflare } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
)

test.before((t) => {
  // Create a new Miniflare environment for each test
  t.context = {
    mf: getMiniflare(),
  }
})

test('Gets Version', async (t) => {
  const { mf } = t.context

  const response = await mf.dispatchFetch('http://localhost:8787/version')
  const { version, commit, branch } = await response.json()

  t.is(version, pkg.version)
  t.is(commit, git.long(__dirname))
  t.is(branch, git.branch(__dirname))
})
