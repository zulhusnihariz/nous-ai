import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'

const contractABI = [
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'buy', outputs: [], stateMutability: 'payable', type: 'function' },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

interface Props {
  isCompleted: boolean
}
const PublicMintBox = (prop: Props) => {
  const [price, setPrice] = useState('')
  const [isDisabled, setDisabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const { address } = useAccount()

  const handleOnMintClicked = async () => {
    if (isDisabled) {
      return
    }

    const rpc = new RPC(window?.ethereum as any)

    try {
      const mintPrice = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'mintPrice',
        data: [],
      })

      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'buy',
        data: [],
        options: {
          value: mintPrice,
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  const showDate = () => {
    const d = new Date(import.meta.env.VITE_PUBLIC_MINT_AFTER_DATE as string)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const date = d.getUTCDate().toString().padStart(2, '0') // Pad single digits with 0
    const month = months[d.getUTCMonth()]
    const year = d.getUTCFullYear()

    const hours = d.getUTCHours()
    const minutes = d.getUTCMinutes().toString().padStart(2, '0') // Pad single digits with 0

    return `${date} ${month}, ${year} ${hours}:${minutes} PM UTC`
  }

  useEffect(() => {
    const getMintPrice = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const mintPrice = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'mintPrice',
        data: [],
      })

      setPrice(mintPrice as string)
    }

    if (!price) {
      getMintPrice().catch(e => console.log(e))
    }

    const isAfterSaleStartDate = () => {
      const currentDate = new Date()
      const saleStartDate = new Date(import.meta.env.VITE_PUBLIC_MINT_AFTER_DATE as string)
      return currentDate > saleStartDate
    }

    const isPaused = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const flag: boolean = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'paused',
        data: [],
      })

      setDisabled(flag || !isAfterSaleStartDate())
    }

    if (!isLoaded) {
      isPaused().catch(console.log)
      setIsLoaded(true)
    }
  }, [isLoaded, price])

  return (
    <>
      <div className="border-black border-2 rounded-lg p-3 sm:p-6 md:flex-row  flex-col items-center justify-between mt-4 mb-4 bg-white/40">
        <div className="md:flex md:justify-between gap-2 items-center ">
          <div className="text-lg font-semibold whitespace-nowrap pr-5 ">Public Sale</div>
          {prop.isCompleted ? (
            <div className="text-xs">SOLD OUT</div>
          ) : (
            <div className="text-xs">Minting is LIVE from {<b className="font-bold">{showDate()}</b>}</div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 justify-center md:justify-end pt-1 ">
          <div className="flex justify-center">
            {isLoaded && !isDisabled && address && !prop.isCompleted && (
              <button
                className={`group relative inline-block text-sm font-medium text-black focus:outline-none focus:ring active:text-gray-500 ${
                  !price || isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={e => handleOnMintClicked()}
              >
                <span className="absolute rounded-md inset-0 translate-x-0.5 translate-y-0.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

                <span className="flex rounded-md items-center relative border border-current bg-white px-8 py-3">
                  {price && <span>Mint for {ethers.formatEther(price)}</span>}E
                </span>
              </button>
            )}

            {isLoaded && (isDisabled || prop.isCompleted) && (
              <button
                className={`group relative inline-block text-sm font-medium text-black focus:outline-none focus:ring active:text-gray-500 ${
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={e => handleOnMintClicked()}
              >
                <span className="absolute rounded-md inset-0 translate-x-0.5 translate-y-0.5 bg-gray-500 transition-transform"></span>
                <span className="flex rounded-md items-center relative border border-gray-800 bg-white px-8 py-3">
                  {'Mint Disabled'}
                </span>
              </button>
            )}
          </div>
          {!address && <span className="text-gray-800 grid place-content-center">Please connect to your wallet</span>}
        </div>
      </div>
    </>
  )
}

export default PublicMintBox
