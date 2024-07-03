<h1 align="center">
  <a href="https://nft.storage"><img width="75%" src="./nftstorage.link-logo.svg" alt="nftstorage.link logo" /></a>
</h1>

<h3 align="center">The IPFS gateway for nft.storage is not "another gateway", but a set of caching layers for NFT’s that sits on top of existing IPFS public gateways.</h3>

<p align="center">
  <a href="https://twitter.com/nft_storage"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/nft_storage?color=00aced&label=twitter&logo=twitter&style=for-the-badge"></a>
</p>

## Product Decommission Notice for New Uploads

### Important Update

Hello from NFT.Storage!

As of June 30, 2024, we have officially decommissioned NFT.Storage Classic uploads. This means that NFT.Storage Classic, including NFTUp, the Classic web app, Classic APIs, Classic SDK, and Pinning API, will no longer accept new uploads/pins.

### What This Means for You

**Service Termination:** NFT.Storage Classic will no longer accept new uploads. However, retrieval of existing data remains operational.

**Data Access:** Don't forget, we're still keeping a copy of your NFT.Storage Classic data available in the NFT.Storage Gateway and in the decentralized Filecoin Network. However, over time, latency and availability may degrade.

**Support:** We’ll be working with the newly formed NFT.Storage community to determine what changes, if any, will impact NFT.Storage Classic data latency and availability in the future. Join the community [Join the community](https://nft.storage/join-us) to have your say. We will keep you informed by email and on Twitter/X.

### Transition to the New Version

For the new version of NFT.Storage, first mint your NFTs, then send us the NFT data—metadata and imagery CIDs, blockchain(s) minted on, contract address, and token IDs. We will preserve these in long-term Filecoin storage. Note that you need to upload the data to IPFS separately. Your NFTs will also be included in the NFT Token Checker, a tool for block explorers, marketplaces, and wallets to show verification that NFT collections, tokens, and CIDs are preserved by NFT.Storage.

### Recommended Hot Storage Alternatives

We’re excited to announce our partnerships with Pinata and Lighthouse for hot storage solutions. As an NFT.Storage user, you support our platform when you choose Pinata and Lighthouse and use our referral links, helping to sustain our valuable public goods. [Learn more here](https://nft.storage/blog/announcing-our-new-partnerships-with-pinata-and-lighthouse).

**Pinata:** Offers flexible plans and powerful, easy-to-use tools for managing your data on IPFS. Use code NFTSTORAGE50 at checkout to enjoy 50% off your first month. [Sign up today](https://pinata.cloud).

**Lighthouse:** An IPFS provider with unique payment options for NFT longevity. They offer affordability and flexibility for all your IPFS needs, including a pay-once and store-forever option. [Sign up today](https://lighthouse.storage).

### Contact Us

For any questions or assistance, contact us [contact us](https://nft.storage/contact-us). Together, we look forward to a promising future for NFT.Storage and the broader NFT ecosystem.

Best regards,  
The NFT.Storage Team

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
