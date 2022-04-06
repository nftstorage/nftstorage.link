# nftstorage.link Developer's Guide

This doc should contain everything you need to know to get a working development environment up and running. If it doesn't and you know what's missing, please open a PR or issue to update the guide!

## Pre-requisites

You'll need at least the following:

- Node.js v16+
- [pnpm](https://pnpm.io/)
- Docker

## Getting Started

We use `pnpm` in this project and commit the `pnpm-lock.yaml` file.

1. Install dependencies.
   ```bash
   # install all dependencies in the mono-repo
   pnpm install
   # setup git hooks
   npx simple-git-hooks
   ```
2. Run locally by starting the following processes.
   1. API server (`pnpm dev` in `/packages/edge-gateway`).
   2. Web server (`pnpm dev` in `/packages/website`).

## Release

[Release Please](https://github.com/googleapis/release-please) automates CHANGELOG generation, the creation of GitHub releases,
and version bumps for our packages. Release Please does so by parsing your
git history, looking for [Conventional Commit messages](https://www.conventionalcommits.org/),
and creating release PRs.

### What's a Release PR?

Rather than continuously releasing what's landed to our default branch, release-please maintains Release PRs:

These Release PRs are kept up-to-date as additional work is merged. When we're ready to tag a release, we simply merge the release PR.

When the release PR is merged the release job is triggered to create a new tag, a new github release and run other package specific jobs. Only merge ONE release PR at a time and wait for CI to finish before merging another.

Release PRs are created individually for each package in the mono repo.

### How should I write my commits?

Release Please assumes you are using [Conventional Commit messages](https://www.conventionalcommits.org/).

The most important prefixes you should have in mind are:

- `fix:` which represents bug fixes, and correlates to a [SemVer](https://semver.org/)
  patch.
- `feat:` which represents a new feature, and correlates to a SemVer minor.
- `feat!:`, or `fix!:`, `refactor!:`, etc., which represent a breaking change
  (indicated by the `!`) and will result in a SemVer major.
