# Gateway perma-cache client

> Client for interacting with the perma-cache layer of the NFT.Storage IPFS Edge Gateway.

The `perma-cache` eases the interaction with [nftstorage.link HTTP API](https://nftstorage.link/api-docs) and improves developer experience. Particularly when you:
- rely on typescript during development.
- want to perma-cache multiple URLs as a batch, like an NFT drop.
- want to have the client taking care of rate limiting prevention.

## Usage

You can import and use this client like:

```js
import { PermaCache } from 'nftstorage.link'

const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })

const urls = [
  'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link'
]

// Perma-cache given URLs
const permaCacheEntries = await cache.put(urls)

// Delete perma-cache URLs
await cache.delete(urls)
```

### Put

> Put URL(s) into the nftstorage.link perma-cache.

```ts
put(urls: string[]): Promise<CacheResult[]>
```

Example:

```js
import { PermaCache } from 'nftstorage.link'

const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })
const permaCacheEntries = await cache.put([
  'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
  'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.nftstorage.link/path',
  'https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
])

console.log(permaCacheEntries)
// [
//   {
//     url: 'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
//     size: 1000,
//     insertedAt: "2022-05-30T11:37:27.878372".
//   },
//   {
//     url: 'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.nftstorage.link/path',
//     size: 2000,
//     insertedAt: "2022-05-30T11:37:29.878372"
//   },
//   {
//     url: 'https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui',
//     size: 3200,
//     insertedAt: "2022-05-30T11:37:30.878372"
//   }
// ]
``` 

### Delete

> Delete URL(s) from the nftstorage.link perma-cache.

```ts
delete(urls: string[]): Promise<CacheDeleteResult[]>
```

Example:

```js
import { PermaCache } from 'nftstorage.link'

const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })
const permaCacheDeletedEntries = await cache.delete([
  'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
  'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.nftstorage.link/path'
])

console.log(permaCacheDeletedEntries)
// [
//   {
//     url: 'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
//   },
//   {
//     url: 'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.nftstorage.link/path',
//   }
// ]
``` 

### List

> List account nftstorage.link perma-cache URLs

```ts
list(options: ListOptions): AsyncIterable<CacheEntry>
```

```js
import { PermaCache } from 'nftstorage.link'

const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })

const permaCacheEntries = []
for await (const entry of cache.list()) {
  permaCacheEntries.push(entry)
}

console.log(permaCacheEntries)
// [
//   {
//     url: 'https://bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq.ipfs.nftstorage.link',
//     size: 1000,
//     insertedAt: "2022-05-30T11:37:27.878372"
//   },
//   {
//     url: 'https://bafybeih74zqc6kamjpruyra4e4pblnwdpickrvk4hvturisbtveghflovq.ipfs.nftstorage.link/path',
//     size: 2000,
//     insertedAt: "2022-05-30T11:37:29.878372"
//   }
// ]
``` 

### Account

> Get perma-cache account info

```ts
accountInfo(): Promise<AccountInfo>
```

```js
import { PermaCache } from 'nftstorage.link'

const cache = new PermaCache({ token: 'YOUR_NFT_STORAGE_TOKEN' })

const accountInfo = await cache.accountInfo()
console.log(accountInfo)
// {
//   usedStorage: 3000
// }
``` 
