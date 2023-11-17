import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'
import useMinting from './hooks'

const contractABI = [
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
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
  const [isAbleToMint, setIsAbleToMint] = useState(false)
  const { address } = useAccount()

  const { canMint } = useMinting()

  useEffect(() => {
    const checkEligible = async () => {
      const nos = (await canMint()) || 0
      setIsAbleToMint(nos > 0 ? false : true)
      setDisabled(nos > 0 ? true : false)
    }

    if (address) {
      checkEligible().catch(console.log)
    }
  }, [canMint, address])

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
        method: 'mint',
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

      setPrice((mintPrice as string) || '0')
    }

    if (!price) {
      getMintPrice().catch(e => console.log(e))
    }

    const isPaused = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const flag: boolean = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'paused',
        data: [],
      })

      setDisabled(flag)
    }

    if (!isLoaded) {
      isPaused().catch(console.log)
      setIsLoaded(true)
    }
  }, [isLoaded, price])

  return (
    <>
      <div className="border-black border-2 rounded-lg p-4 flex items-center justify-between mt-4 mb-4 bg-white/40">
        <div>
          <div className="text-lg font-semibold">Public Sale</div>
          {!isAbleToMint && <div className="text-xs text-red-800">Restricted only to a single NFT per wallet</div>}
        </div>
        {isLoaded && !isDisabled && address && (
          <button
            className={`group relative inline-block text-sm font-medium text-black focus:outline-none focus:ring active:text-gray-500 ${
              !price || isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={e => handleOnMintClicked()}
          >
            <span className="absolute rounded-md inset-0 translate-x-0.5 translate-y-0.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
            <span className="flex rounded-md items-center relative border border-current bg-white px-10 py-3">
              {price && <span>Mint</span>}
            </span>
          </button>
        )}
        {isLoaded && isDisabled && address && (
          <div className="flex flex-col gap-1">
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
          </div>
        )}
        {!address && <span className="text-sm text-gray-600">Connect to your wallet</span>}
      </div>
    </>
  )
}

export default PublicMintBox
