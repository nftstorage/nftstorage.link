import Img from '../components/cloudflareImage'
import kwesforms from 'kwesforms'
import Circles from './circles'
import CheckMark from './checkMark'
import { useEffect } from 'react'

export default function Superhot() {
  useEffect(() => {
    kwesforms.init()
  }, [])

  return (
    <>
      <div className="circle-container overflow-hidden">
        <Circles />
      </div>
      <div className="bg-peach relative overflow-hidden text-center">
        <div className="circle-container overflow-hidden -mt-[50px] lg:mt-[-70px]">
          <Circles />
        </div>
        <div className="mx-auto max-w-7xl w-full pt-16 pb-20 lg:py-32 mt-12">
          <div className="relative px-6">
            <h1 className="font-open-sans text-xl lg:text-2xl leading-snug font-bold text-black ">
              <span className="block">
                Want more speed? Check out our premium features!
              </span>
            </h1>
          </div>

          <div className="px-6 max-w-5xl mx-auto mt-12">
            <div className="relative  before:bg-[#F5C32C] before:absolute before:w-full before:h-full before:left-4 before:-top-4">
              <div className="relative bg-white p-6 sm:p-10 lg:p-16 border-2 border-black">
                <Img
                  src="images/superhot-logo.svg"
                  alt="logo"
                  className="mb-12 mx-auto block"
                />

                <h4 className="text-lg md:text-xl leading-snug lg:text-2xl font-semibold max-w-4xl mx-auto">
                  Perma-cache NFT files of up to 5GB on the edge to guarantee
                  the fastest possible read performance by anyone on the web.{' '}
                  <a
                    href="https://nftstorage.link/api-docs"
                    target="_blank"
                    rel="noreferrer"
                    className="underline cursor-pointer underline-offset-4 text-orangred hover:text-blue transition-colors"
                  >
                    BETA API Docs
                  </a>
                </h4>

                {/* <p className="mt-8">
                  
                </p> */}

                <ul className="max-w-lg text-lg mx-auto mt-12">
                  <li className="flex text-left my-8 items-start">
                    <CheckMark />
                    <p className="">
                      100 ms time-to-first-byte for 95% of the world’s
                      Internet-connected population
                    </p>
                  </li>
                  <li className="flex text-left my-8 items-start">
                    <CheckMark />
                    <p className="">Best-in-class pricing</p>
                  </li>
                  <li className="flex text-left mb-8 mt-12 items-start">
                    <CheckMark />
                    <p className="">
                      <small className="block absolute uppercase font-bold text-xs -mt-4 text-blue">
                        Coming Soon
                      </small>
                      Centralized URL support (cache even non-IPFS data)
                    </p>
                  </li>
                  <li className="flex text-left mb-8 mt-12 items-start">
                    <CheckMark />
                    <p className="">
                      <small className="block absolute uppercase font-bold text-xs -mt-4 text-blue">
                        Coming Soon
                      </small>
                      API for artists and collectors to perma-cache their
                      collections.
                    </p>
                  </li>
                  <li className="flex text-left mb-8 mt-12 items-start">
                    <CheckMark />
                    <p className="">
                      <small className="block absolute uppercase font-bold text-xs -mt-4 text-blue">
                        Coming Soon
                      </small>
                      Perma-cache files of any size
                    </p>
                  </li>
                </ul>

                <p>
                  Fill out the form below and we will reach out to discuss plans
                  and pricing.
                </p>
                <form
                  className="kwes-form text-left max-w-lg text-lg mx-auto mt-12"
                  action="https://kwesforms.com/api/foreign/forms/KM4DKZXvoyTrgzJ21Do6"
                >
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-semibold text-black"
                      >
                        First name<span className="text-red">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          rules="required"
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold text-black"
                      >
                        Last name<span className="text-red">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          rules="required"
                          autoComplete="family-name"
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-black"
                      >
                        Email address associated with your NFT.Storage account
                        <span className="text-red">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="name@email.com"
                          rules="required|email"
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-black"
                      >
                        Estimated number of files you&apos;d like to cache
                      </label>
                      <div className="mt-1">
                        <input
                          id="size"
                          name="size"
                          type="text"
                          placeholder="10,000"
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-black"
                      >
                        Organization
                      </label>
                      <div className="mt-1">
                        <input
                          id="org"
                          name="org"
                          type="text"
                          placeholder="Acme Corp."
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-black"
                      >
                        Job Title
                      </label>
                      <div className="mt-1">
                        <input
                          id="title"
                          name="title"
                          type="text"
                          placeholder="Engineer"
                          className="px-2 py-1 focus:ring-indigo-500 focus:border-blue block w-full border-black border-2 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <button
                        type="submit"
                        className="btn py-2 uppercase inline-flex items-center px-5 rounded-md bg-orange text-white text-sm font-semibold"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="relative px-4 sm:px-8 mt-16">
            <h1 className="font-open-sans font-bold text-black text-xl lg:text-2xl px-6 leading-snug">
              Additional Premium Features on the Roadmap
            </h1>

            <div className="max-w-4xl mx-auto mt-24 px-6">
              <div className="rounded-lg sm:grid sm:grid-cols-2 text-left gap-12 space-y-16 sm:space-y-0">
                <div className="flex">
                  <Img
                    src="images/icon-resize.svg"
                    alt="resize"
                    className="mr-8 w-12"
                  />
                  <div>
                    <small className="block absolute uppercase font-bold text-xs -mt-4 text-blue">
                      Coming Soon
                    </small>
                    <h5 className="text-xl font-bold">Image Resizing</h5>
                    <p className="">
                      Image resizing in the NFT.Storage Gateway. Great for
                      thumbnails, etc.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <Img
                    src="images/icon-speed.svg"
                    alt="resize"
                    className="mr-8 w-12"
                  />
                  <div>
                    <small className="block absolute uppercase font-bold text-xs -mt-4 text-blue">
                      Coming Soon
                    </small>
                    <h5 className="text-xl font-bold">IPNS Caching</h5>
                    <p className="">
                      Auto-cache updates to IPNS records for fast updates to
                      mutable NFTs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
