import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'

const contractABI = [
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'isWhitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'isWhitelistedClaimed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'communityBuy', outputs: [], stateMutability: 'payable', type: 'function' },
]


const WhitelistMintBox = () => {
  const { address } = useAccount()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [isWhitelistClaimed, setIsWhitelistClaimed] = useState(false)

  const handleOnMintClicked = async () => {
    const rpc = new RPC(window?.ethereum as any)

    await rpc.callContractMethod({
      contractABI,
      contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
      method: 'communityBuy',
      data: [],
      options: {
        value: '0',
      },
    })
  }

  useEffect(() => {
    const getWhitelist = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const flag = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'isWhitelisted',
        data: [address as `0x${string}`],
      })

      setIsWhitelisted(flag)
    }

    const getWhitelistClaimed = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const flag = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'isWhitelistedClaimed',
        data: [address as `0x${string}`],
      })

      setIsWhitelistClaimed(flag)
    }

    if (address) {
      setIsLoaded(false);
      getWhitelist().then(() => getWhitelistClaimed()).then(()=>setIsLoaded(true)).catch(e => console.log(e))
    }
  }, [address])



  return (
    <>
      {isWhitelisted && (
        <div className="border-black border-2 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Full Discount Eligibility</div>
            <div className="text-xs">You qualify for 100% discount</div>
          </div>
          {!isWhitelistClaimed && (
            <button
              className={`group relative inline-block text-sm font-medium text-black focus:outline-none focus:ring active:text-gray-500 ${
                !isLoaded ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={e => handleOnMintClicked()}
            >
              <span className="absolute inset-0 rounded-lg translate-x-0.5 translate-y-0.5 bg-black transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>
              <span className="flex items-center rounded-lg relative border border-current bg-white px-8 py-3">
                <span>Mint</span>
              </span>
            </button>
          )}
          {isWhitelistClaimed && (
            <button
              className={`group relative inline-block text-sm font-medium text-black focus:outline-none focus:ring active:text-gray-500 cursor-not-allowed`}
            >
              <span className="absolute inset-0 rounded-lg translate-x-0.5 translate-y-0.5 bg-gray-500 transition-transform"></span>
              <span className="flex items-center rounded-lg relative border border-gray-800 bg-white px-8 py-3">
                <span>Minted</span>
              </span>
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default WhitelistMintBox
