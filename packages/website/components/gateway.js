import { useState } from 'react'

export default function Gateway() {
  const [cid, setCid] = useState(
    'QmSiLSBTJ7NRmw6P926tXVrRtkmXjc2grJtF28gtpoQ2JX'
  )
  // QmcMBwDT8wEjNaVgFpQjhZMKPEgHAwNHTErpZTvPzLdvvi
  const handleCIDLink = (e) => {
    e.preventDefault()
    window.open(`https://nftstorage.link/ipfs/${cid}`, '_blank')
  }

  return (
    <div id="try-it" className="bg-white relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-32 px-6">
        <div className="relative px-4 sm:px-8">
          <h1 className="font-open-sans text-3xl font-bold text-black lg:text-4xl">
            <span className="block">The NFT.Storage Gateway</span>
          </h1>
          <p className="mt-3 mx-auto text-lg text-gray-900 sm:text-xl md:mt-5 md:max-w-4xl">
            The NFT.Storage gateway is optimized for NFT content stored on IPFS,
            and is especially fast if that content is stored on NFT.Storage.
            Plug your NFT&apos;s content ID (CID) below to try it out.
          </p>
        </div>
        <form>
          <div className="sm:flex rounded-md max-w-3xl mx-auto mt-12 space-y-2 sm:space-y-0">
            <span className="sm:inline-flex items-center px-3 sm:rounded-l-md sm:border-2 sm:border-r-0 sm:border-black sm:bg-gray-100 text-gray-500 sm:text-sm md:text-lg">
              https://nftstorage.link/ipfs/
            </span>
            <input
              type="text"
              name="cid"
              id="cid"
              onChange={(e) => setCid(e.target.value)}
              value={cid}
              className="truncate flex-1 min-w-0 block w-full px-3 py-3 rounded sm:rounded-none sm:rounded-r-md sm:text-sm md:text-lg border-2 border-black text-black placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="cid..."
            />
            <button
              type="submit"
              onClick={(e) => handleCIDLink(e)}
              className="inline-flex items-center px-5 py-2 rounded-lg border-2 border-red sm:ml-4 bg-orange text-white sm:text-sm md:text-lg font-semibold"
            >
              GO
            </button>
          </div>
        </form>

        <div className="max-w-6xl mx-auto mt-6 sm:mt-24">
          <dl className="rounded-lg bg-white md:grid grid-cols-3 text-center">
            <div className="flex flex-col  p-6 text-center">
              <dt className="mt-2 text-6xl xl:text-7xl leading-tight font-goldman font-bold text-forest">
                2-3x
              </dt>
              <dd className="text-lg xl:text-xl leading-tight font-semibold">
                Faster than other public IPFS Gateways for avg. NFT reads
              </dd>
            </div>
            <div className="flex flex-col p-6 text-center">
              <dt className="mt-2 text-6xl xl:text-7xl leading-tight font-goldman font-bold text-blue">
                1PiB+
              </dt>
              <dd className="text-lg xl:text-xl leading-tight font-semibold">
                Served per month
              </dd>
            </div>
            <div className="flex flex-col p-6 text-center">
              <dt className="mt-2 text-6xl xl:text-7xl leading-tight font-goldman font-bold text-orange">
                270+
              </dt>
              <dd className="text-lg xl:text-xl leading-tight font-semibold">
                Points of Presence
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
