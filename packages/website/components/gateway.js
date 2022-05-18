import { useState } from 'react'

export default function Gateway() {
  const [cid, setCid] = useState(
    'bafybeiedv7sowwxamly4oicivudp45rsfvbklnf3fvbvonxrwoxqylhtwq/0.json'
  )
  // QmcMBwDT8wEjNaVgFpQjhZMKPEgHAwNHTErpZTvPzLdvvi
  const handleCIDLink = (e) => {
    e.preventDefault()
    window.open(`https://nftstorage.link/ipfs/${cid}`, '_blank')
  }

  return (
    <div id="try-it" className="bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-32 px-6">
        <div className="relative">
          <h1 className="font-open-sans text-3xl font-bold text-black lg:text-4xl">
            <span className="block">The NFT.Storage Gateway</span>
          </h1>
          <p className="mt-3 text-lg text-gray-900 sm:text-xl md:mt-5 md:max-w-4xl">
            The NFT.Storage gateway is optimized for NFT content stored on IPFS,
            and is especially fast if that content is stored on NFT.Storage.
            Plug your NFT&apos;s content ID (CID) below to try it out.
          </p>
        </div>
        <form>
          <div className="sm:flex rounded-md max-w-3xl mt-12 space-y-2 sm:space-y-0">
            <span className="sm:inline-flex items-center sm:px-3 sm:rounded-l-md sm:border-2 sm:border-r-0 sm:border-black sm:bg-gray-100 text-gray-500 md:text-lg">
              https://nftstorage.link/ipfs/
            </span>
            <input
              type="text"
              name="cid"
              id="cid"
              onChange={(e) => setCid(e.target.value)}
              value={cid}
              className="truncate flex-1 min-w-0 block w-full px-3 py-3 rounded sm:rounded-none sm:rounded-r-md md:text-lg border-2 border-black text-black placeholder:text-gray-500 focus:ring-blue focus:border-blue"
              placeholder="cid..."
            />
            <button
              type="submit"
              onClick={(e) => handleCIDLink(e)}
              className="btn inline-flex items-center px-5 py-2 rounded-lg sm:ml-4 bg-orange text-white sm:text-sm md:text-lg font-semibold hover:bg-blue transition-colors"
            >
              GO
            </button>
          </div>
        </form>

        <div className="max-w-6xl mt-6 sm:mt-12">
          <p className="mt-3 mb-4 text-lg text-gray-900 sm:text-xl md:mt-12 md:max-w-4xl">
            Gateway at a Glance
          </p>
          <dl className="rounded-lg bg-white md:grid grid-cols-3 space-y-4 md:space-y-0 gap-2 md:gap-8 xl:gap-12">
            <div className="flex flex-col pt-2 pb-6 px-6 rounded-lg bg-forest/[.06]">
              <dt className="mt-2 text-6xl xl:text-7xl leading-1 font-goldman font-bold text-forest">
                2-3x
              </dt>
              <dd className="text-sm md:text-base uppercase font-semibold">
                Faster than other public IPFS Gateways for average NFT reads
              </dd>
            </div>
            <div className="flex flex-col pt-2 pb-6 px-6 rounded-lg bg-blue/[.06]">
              <dt className="mt-2 text-6xl xl:text-7xl leading-1 font-goldman font-bold text-blue">
                1PiB+
              </dt>
              <dd className="text-sm md:text-base uppercase font-semibold">
                Served per month
              </dd>
            </div>
            <div className="flex flex-col pt-2 pb-6 px-6 rounded-lg bg-orange/[.06]">
              <dt className="mt-2 text-6xl xl:text-7xl leading-1 font-goldman font-bold text-orange">
                270+
              </dt>
              <dd className="text-sm md:text-base uppercase font-semibold">
                Points of Presence
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
