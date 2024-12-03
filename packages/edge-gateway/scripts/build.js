import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'
import git from 'git-rev-sync'
import Sentry from '@sentry/cli'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
)

/**
 * @param {{ env: string; }} opts
 */
export async function buildCmd(opts) {
  const sentryRelease = `nftlink-edge-gateway@${pkg.version}-${
    opts.env
  }+${git.short(__dirname)}`
  console.log(`Building ${sentryRelease}`)

  await build({
    entryPoints: [path.join(__dirname, '..', 'src', 'index.js')],
    bundle: true,
    format: 'esm',
    outfile: path.join(__dirname, '..', 'dist', 'worker.js'),
    legalComments: 'external',
    define: {
      SENTRY_RELEASE: JSON.stringify(sentryRelease),
      VERSION: JSON.stringify(pkg.version),
      COMMITHASH: JSON.stringify(git.long(__dirname)),
      BRANCH: JSON.stringify(git.branch(__dirname)),
      global: 'globalThis',
    },
    minify: opts.env === 'dev' ? false : true,
    sourcemap: 'external',
  })

  // Sentry release and sourcemap upload
  if (process.env.SENTRY_UPLOAD === 'true') {
    const cli = new Sentry(undefined, {
      authToken: process.env.SENTRY_TOKEN,
      org: 'storacha-it',
      project: 'nft-gateway',
      dist: git.short(__dirname),
    })

    await cli.releases.new(sentryRelease)
    await cli.releases.setCommits(sentryRelease, {
      auto: true,
      ignoreEmpty: true,
      ignoreMissing: true,
    })
    await cli.releases.uploadSourceMaps(sentryRelease, {
      include: [path.join(__dirname, '..', 'dist')],
      ext: ['map', 'js'],
    })
    await cli.releases.finalize(sentryRelease)
    await cli.releases.newDeploy(sentryRelease, {
      env: opts.env,
    })
  }
}
