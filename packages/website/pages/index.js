/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head'
import Img from '../components/cloudflareImage'
import Hero from '../components/hero'
import Gateway from '../components/gateway'
import Superhot from '../components/superhot'

export default function Home() {
  return (
    <div className="relative bg-gray-50">
      <Head>
        <title>nftstorage.link</title>
        <meta
          name="description"
          content="The IPFS gateway for nft.storage is not 'another gateway', but a caching layer for NFT’s that sits on top of existing IPFS public gateways."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="lg:relative font-open-sans">
        <Hero />
        <Gateway />
        <Superhot />
      </main>
      <footer className="bg-peach">
        <div className="mx-auto max-w-6xl w-full pt-16 pb-20 6">
          <div className="text-center lg:text-left lg:flex justify-between items-center px-6 space-y-6 lg:space-y-0">
            <Img
              src="images/nftstorage.link-logo.svg"
              alt="logo"
              className="mx-auto lg:mx-0 max-w-[220px]"
            />
            <div className="space-x-4">
              <a
                href="https://nft.storage"
                className=""
                target="_blank"
                rel="noopener noreferrer"
              >
                NFT.Storage
              </a>
              <a
                href="https://ipfs.io"
                className="border-l border-l-black pl-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                IPFS
              </a>
              <a
                href="/terms"
                className="border-l border-l-black pl-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
