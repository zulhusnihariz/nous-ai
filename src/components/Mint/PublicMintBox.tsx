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

const PublicMintBox = () => {
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
      <div className="border-black border-2 rounded-lg p-6 flex items-center justify-between mt-4 mb-4 bg-white/40">
        <div>
          <div className="text-lg font-semibold">Public Sale</div>
          <div className="text-xs">
            Minting is LIVE from <b className="font-bold">07 Oct, 2023 1:00 PM UTC</b>
          </div>
        </div>
        {isLoaded && !isDisabled && address && (
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
        {!address && <span className="text-gray-800">Please connect to your wallet</span>}
      </div>
    </>
  )
}

export default PublicMintBox
