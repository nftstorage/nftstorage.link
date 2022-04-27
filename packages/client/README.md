# nftstorage.link client utilities

Utilities for working with the NFT.Storage IPFS Edge Gateway.

## Install

```console
npm install nftstorage.link
```

## Usage

Import the library in your client application like:

```js
import { getGatewayURL } from 'nftstorage.link'
```

### `getGatewayURL`

Get a gateway URL, given a CID, CID+path, IPFS path or an IPFS gateway URL. If the status of the `nftstorage.link` gateway is known to be good (according to the status checker) then return a URL that uses `nftstorage.link`, otherwise return an URL that uses `dweb.link` (or the optional passed fallback gateway URL). Status result is cached for **60 seconds** by default.

Note: the fallback gateway is not guaranteed to be operational and this library makes no attempt to verify this.

```ts
getGatewayURL (cid: string|URL): Promise<string>
// (typical usage - also takes options object as second param)
```

#### Examples

```js
const url = await getGatewayURL(
  'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
)
console.log(url)
// https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
// or
// https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

Also works with CID + path:

```js
const url = await getGatewayURL(
  'bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json'
)
console.log(url)
// https://nftstorage.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json
// or
// https://dweb.link/ipfs/bafyreihwsoxxcxfsisghlc22xzc6datssd7n52wonpdgrhu3lwyqqagzye/metadata.json
```

Also works with `ipfs://` URL:

```js
const url = await getGatewayURL(
  'ipfs://bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
)
console.log(url)
// https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
// or
// https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

Also works with _any_ IPFS gateway URL:

```js
const url = await getGatewayURL(
  'https://ipfs.io/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui'
)
console.log(url)
// https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
// or
// https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

...including _subdomain_ gateway URL:

```js
const url = await getGatewayURL(
  'https://bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui.ipfs.dweb.link'
)
console.log(url)
// https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
// or
// https://dweb.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

You can also specify a different fallback gateway URL:

```js
const fallbackGatewayURL = 'https://ipfs.io' // default is 'https://dweb.link'
const url = await getGatewayURL(
  'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui',
  { fallbackGatewayURL }
)
console.log(url)
// https://nftstorage.link/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
// or
// https://ipfs.io/ipfs/bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui
```

##### React Components

Example of how this function could be used in a React project:

```js
import { useState, useEffect } from 'react'
import { getGatewayURL } from 'nftstorage.link'

function GatewayLink({ cid, title }) {
  const [url, setUrl] = useState('')
  useEffect(async () => setUrl(await getGatewayURL(cid)), [cid])
  return url ? <a href={url}>{title}</a> : null
}

function GatewayImage({ cid, alt }) {
  const [url, setUrl] = useState('')
  useEffect(async () => setUrl(await getGatewayURL(cid)), [cid])
  return url ? <img src={url} alt={alt} /> : null
}
```

##### Node.js usage

This library uses the `fetch` API. In Node.js there are two options to enable usage:

Assign to global:

```js
import fetch from '@web-std/fetch' // npm install @web-std/fetch
globalThis.fetch = fetch
// use getGatewayURL etc. as usual
```

Pass to `GatewayStatusChecker`:

```js
import { getGatewayURL, GatewayStatusChecker } from 'nftstorage.link'
import fetch from '@web-std/fetch' // npm install @web-std/fetch

const statusChecker = new GatewayStatusChecker({ fetch })
const url = await getGatewayURL(
  'bafkreiem4twkqzsq2aj4shbycd4yvoj2cx72vezicletlhi7dijjciqpui',
  { statusChecker }
)
```

## Contributing

Feel free to join in. All welcome. [Open an issue](https://github.com/nftstorage/nftstorage.link/issues)!

If you're opening a pull request, please see the [guidelines in DEVELOPMENT.md](https://github.com/nftstorage/nftstorage.link/blob/main/DEVELOPMENT.md#how-should-i-write-my-commits) on structuring your commit messages so that your PR will be compatible with our [release process](https://github.com/nftstorage/nftstorage.link/blob/main/DEVELOPMENT.md#release).

## License

Dual-licensed under [MIT + Apache 2.0](https://github.com/nftstorage/nftstorage.link/blob/main/LICENSE.md)
