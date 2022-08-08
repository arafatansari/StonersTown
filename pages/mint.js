import { useState, useEffect } from 'react'
import Image from 'next/image'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import Head from 'next/head'
import Link from 'next/link'

import {
  getTotalMinted,
  getMaxSupply,
  isPublicSaleState,
  maxMintAmount,
  publicMint,
  getWalletLimit,
  MaxMintAmount,
  getprice,
  getPrice
} from '../utils/interact'

export default function Mint() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [maxWalletLimit, setWalletLimit] = useState(0)
  const [price, setPrice] = useState(0)

  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)

  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }

      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())
      setMaxMintAmount(await MaxMintAmount())
      setIsPublicSale(await isPublicSaleState())
      setWalletLimit(await getWalletLimit())
      setPrice(await getPrice())
    }

    init()
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }


  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="w-full h-full flex flex-col items-center justify-center">

           <Head>
            <title>{config.mintTitle}</title>
            <meta name="description" content={config.mintDescription} />
            <link rel="icon" href="/favicon.ico" />
           </Head>



        <Image
          src="/images/Blur.gif"
          alt='Background'
          layout='fill'
          className="absolute inset-auto block w-full min-h-screen object-cover"
        />
        
        <header className=" relative w-full h-full flex flex-col items-center justify-center">
          <div className="flex items-center justify-end space-x-4 md:space-x-14">
            <a href="https://twitter.com/StonersTownWTF" target="_blank" rel="noreferrer">
              <Image src="/images/Twitter.png" width="64" height="64" />
            </a>
            <a href="https://opensea.io/collection/stonerstownwtf" target="_blank" rel="noreferrer">
              <Image src="/images/Opensea.png" width="64" height="64" />
            </a>
            <a href="https://discord.gg/PrgT3nkKVr" rel="noreferrer">
              <Image src="/images/Discord.png" width="64" height="64" />
            </a>
            <div className="flex items-center justify-end space-x-4 md:space-x-14">
              <Image src="/images/Logo.gif" rel="noreferrer" width="400" height="160" />
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="relative z-1 md:max-w-2xl w-full filter py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
            {wallet && (
              <button
                className="absolute right-4 font-autour-one text-black mx-4 tracking-wide"
                onClick={() =>
                  disconnect({
                    label: wallet.label
                  })
                }
              >
                Disconnect
              </button>
            )}

            <div className="flex flex-col md:flex-row md:space-x-14 w-full">

              <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                <div className="flex items-center justify-between w-full">
                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={incrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>

                  <p className="flex items-center justify-center flex-1 grow text-center font-bold text-black-800 text-3xl md:text-4xl">
                    {mintAmount}
                  </p>

                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                    onClick={decrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-xl text-green-200 tracking-widest mt-10">
                  Max Mint Amount: {maxMintAmount}
                </p>



                <p>
                    <span className="text-xl text-green-200 tracking-widest mt-10">
                     Mint Count: {totalMinted}</span> /{' '}
                    {maxSupply}
                  </p>

              {/* Uncomment the below div once the free mint is over */}
              <div className="order-t border-b px-4 py-4 rounded-md mt-16 w-2xl  hover:shadow-lg bg-cyan-700">
                  <div className="w-full text-xl flex items-center justify-between text-brand-yellow">
                    <p>Total &nbsp;</p>

                    <div className="flex items-center space-x-2 text-blue-100">
                      <p>
                        {Number.parseFloat(config.price * mintAmount).toFixed(
                          4
                        )}{' '}
                        ETH
                      </p>
                      {' '}
                      <span className="text-gray-400">+ GAS</span>
                    </div>

                  </div>
                </div>
              
               {/* Comment the below section after free mint is over */}
               {/* <div className="border-t border-b px-4 py-4 rounded-md mt-16 w-2xl  hover:shadow-lg bg-cyan-700">
                  <div className="w-full text-xl flex items-center justify-between text-brand-yellow">
                    <p>Free Mint &nbsp; </p>

                    <div className="flex items-center space-x-2 text-blue-100">
                      <p>
                         TILL 
                      </p>
                      <span className="text-gray-400"> 510</span>
                    </div>

                  </div>
                </div> */}

                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <button
                    className={` ${
                       isMinting
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-gradient-to-br bg-gray-300 from-brand-brown to-brand-green shadow-lg hover:shadow-brown-400/50'
                    }   mintNowButton mt-12 w-full px-6 py-3 rounded-md text-2xl text-black  hover:shadow-pink-400/50  mx-4 tracking-wide uppercase`}
                    onClick={publicMintHandler}
                  >
                    {isMinting ? 'Minting...' : 'Mint'}
                  </button>
                ) : (
                  <button
                    className=" mintNowButton font-cursive mt-12 w-full bg-gray-400 bg-gradient-to-br from-brand-brown to-brand-green shadow-lg px-6 py-3 rounded-md text-2xl text-black hover:shadow-pink-400/50 mx-4 tracking-wide uppercase"
                    onClick={() => connect()}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
              >
                <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )}

            {/* Contract Address */}
            <div className="contButton rounded-md bg-gradient-to-r py-10 from-cyan-400 to-green-500 flex flex-col items-center mt-10  h-full w-full">
              <h3 className="font-sm text-2xl text-white-900">
                Contract Address
              </h3>
              <a
                href={`https://etherscan.io/address/${config.contractAddress}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black-400"
              >
                <span className="break-all ...">{config.contractAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}