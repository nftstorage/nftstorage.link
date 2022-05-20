import Img from '../components/cloudflareImage'

export default function Hero() {
  return (
    <div className="bg-peach relative overflow-hidden">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:pb-36 lg:py-16 px-6">
        <div className="relative z-10 md:w-3/5 xl:pr-16">
          <Img
            src="images/nftstorage.link-logo.svg"
            alt="logo"
            className="mb-24 max-w-[70vw]"
          />
          <h1 className="font-open-sans text-3xl font-bold text-gray-900 md:max-w-3xl lg:text-4xl xl:text-5xl lg:leading-tight">
            <span className="inline sm:block">Lightning fast NFT reads </span>
            <span className="inline sm:block">from the IPFS network</span>
          </h1>
          <p className="mt-3 max-w-md text-lg text-gray-900 sm:text-xl md:mt-5 md:max-w-3xl">
            Using IPFS to ensure your NFTs are cryptographically tied to your
            content, but tired of your NFTs loading slowly? The NFT.Storage
            Gateway (nftstorage.link) marries IPFS content IDs with CDNs to
            provide a highly performant read experience.
          </p>
          <div className="mt-10 sm:flex justify-start">
            <a
              href="#try-it"
              className="uppercase underline underline-offset-4 text-orangred font-bold hover:text-blue transition-colors"
            >
              Try it Out
            </a>
            <a
              href="/api-docs"
              target="_blank"
              className="uppercase underline underline-offset-4 text-orangred font-bold ml-8 hover:text-blue transition-colors"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>
      <div className="opacity-20 md:opacity-100 absolute w-full h-96 sm:h-72 lg:h-full inset-0">
        <div className="absolute h-screen grid grid-cols-4 gap-4 lg:gap-6 xl:gap-10 right-0 translate-x-[20vw] lg:translate-x-[10vw] 2xl:translate-x-0">
          <div className="bg-yellow h-[250vh] -translate-y-1/2 -translate-x-1/2 p-1 w-12 lg:w-16 xl:w-24 rotate-30">
            <div className="animate-travel-1">
              <Img src="images/rainbow-smiley.svg" alt="rainbow smiley" />
            </div>
          </div>
          <div className="bg-orange h-[250vh] -translate-y-1/2 -translate-x-1/2 p-1 w-12 lg:w-16 xl:w-24 rotate-30">
            <div className="animate-travel-2">
              <Img src="images/rainbow-smiley.svg" alt="rainbow smiley" />
            </div>
          </div>
          <div className="bg-forest h-[250vh] -translate-y-1/2 -translate-x-1/2 p-1 w-12 lg:w-16 xl:w-24 rotate-30">
            <div className="animate-travel-3">
              <Img src="images/rainbow-smiley.svg" alt="rainbow smiley" />
            </div>
          </div>
          <div className="bg-blue h-[250vh] -translate-y-1/2 -translate-x-1/2 p-1 w-12 lg:w-16 xl:w-24 rotate-30">
            <div className="animate-travel-4">
              <Img src="images/rainbow-smiley.svg" alt="rainbow smiley" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
