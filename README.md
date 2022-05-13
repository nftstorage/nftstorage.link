<h1 align="center">
  <a href="https://nft.storage"><img width="75%" src="./nftstorage.link-logo.svg" alt="nftstorage.link logo" /></a>
</h1>

<h3 align="center">The IPFS gateway for nft.storage is not "another gateway", but a set of caching layers for NFT’s that sits on top of existing IPFS public gateways.</h3>

<p align="center">
  <a href="https://discord.com/channels/806902334369824788/831502708082081822"><img src="https://img.shields.io/badge/chat-discord?style=for-the-badge&logo=discord&label=discord&logoColor=ffffff&color=7389D8" /></a>
  <a href="https://twitter.com/nft_storage"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/nft_storage?color=00aced&label=twitter&logo=twitter&style=for-the-badge"></a>
</p>

# Table of Contents <!-- omit in toc -->

- [Usage](#usage)
- [Packages](#packages)
  - [API](#api)
  - [Client](#client)
  - [Edge gateway](#edge-gateway)
- [Building](#building)
- [Contributing](#contributing)
- [License](#license)

## Usage

Get your NFTs from the IPFS Network via their unique content identifier with a lightning fast experience. Like any other IPFS gateway, `nftstorage.link` supports IPFS path style resolutions `https://nftstorage.link/ipfs/{cid}` and subdomain style resolution `https://{CID}.ipfs.nftstorage.link/{optional path to resource}`

```
> curl https://nftstorage.link/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq
Hello nft.storage! 😎

> curl https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link
Hello nft.storage! 😎
```

## Packages

### API

nftstorage.link provides an HTTP API that allows the optimization of our caching strategies to given content.

Check out the [API documentation](./packages/api).

### Client

A set of utilities for working with the NFT.Storage IPFS Edge Gateway and its API.

Check out the [Client documentation](./packages/client).

### Edge gateway

The core of nftstorage.link, the Edge Gateway is serverless code running across the globe to provide fast IPFS content retrieval.

Check out the [Edge Gateway documentation](./packages/edge-gateway).

## Building

Want to help us improve nftstorage.link? Great! This project uses node v16 and pnpm. It's a monorepo that use workspaces to handle resolving dependencies between the local `packages/*` folders.

Copy the <.env.tpl> file to `.env` and install the deps with `pnpm`.

```console
# install deps
pnpm install
```

# Contributing

Feel free to join in. All welcome. [Open an issue](https://github.com/nftstorage/nftstorage.link/issues)!

If you're opening a pull request, please see the [guidelines in DEVELOPMENT.md](./DEVELOPMENT.md#how-should-i-write-my-commits) on structuring your commit messages so that your PR will be compatible with our [release process](./DEVELOPMENT.md#release).

# License

Dual-licensed under [MIT + Apache 2.0](https://github.com/nftstorage/nftstorage.link/blob/main/LICENSE.md)
