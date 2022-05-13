export default function Gateway() {
  return (
    <div className="bg-white relative overflow-hidden text-center">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-32 px-6">
        <div className="relative px-4 sm:px-8">
          <h1 className="font-open-sans text-3xl font-bold text-black lg:text-4xl">
            <span className="block">The NFT.Storage Gateway</span>
          </h1>
          <p className="mt-3 mx-auto text-lg text-gray-900 sm:text-xl md:mt-5 md:max-w-4xl">
            The NFT.Storage gateway is optimized for NFT content stored on IPFS,
            and is especially fast if that content is stored on NFT.Storage.
            Plug your NFT's content ID (CID) below to try it out.
          </p>
        </div>
        <form>
          <div className="mt-1 flex rounded-md shadow-sm max-w-xl mx-auto mt-12">
            <span className="inline-flex items-center px-3 rounded-l-md border-2 border-r-0 border-black bg-gray-100 text-gray-500 sm:text-sm md:text-lg">
              https://nftstorage.link/ipfs/
            </span>
            <input
              type="text"
              name="company-website"
              id="company-website"
              className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md sm:text-sm md:text-lg border-2 border-black text-black placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="cid..."
            />
            <button
              type="submit"
              className="inline-flex items-center px-5 rounded-lg border-2 border-red ml-4 bg-orange text-white sm:text-sm md:text-lg font-semibold"
            >
              GO
            </button>
          </div>
        </form>

        <div className="max-w-6xl mx-auto mt-24">
          <dl className="rounded-lg bg-white sm:grid sm:grid-cols-3 text-center">
            <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
              <dt className="mt-2 text-7xl leading-tight font-goldman font-bold text-forest">
                2-3x
              </dt>
              <dd className="text-xl leading-tight font-semibold">
                Faster than other public IPFS Gateways for avg. NFT reads
              </dd>
            </div>
            <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
              <dt className="mt-2 text-7xl leading-tight font-goldman font-bold text-blue">
                1PiB+
              </dt>
              <dd className="text-xl leading-tight font-semibold">
                Served per month
              </dd>
            </div>
            <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
              <dt className="mt-2 text-7xl leading-tight font-goldman font-bold text-orange">
                270+
              </dt>
              <dd className="text-xl leading-tight font-semibold">
                Points of Presence
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
