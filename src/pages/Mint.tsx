import PublicMintBox from 'components/Mint/PublicMintBox'
import TimelineMint from 'components/Mint/TimelineMint'
import TransactionMint from 'components/Mint/TransactionMint'
import WhitelistMintBox from 'components/Mint/WhitelistMintBox'
import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxTokens',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const PageMint = () => {
  const [supply, setTotalSupply] = useState(0)
  const [max, setMaxSupply] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const getTotalSupply = async () => {
      const rpc = new RPC(window?.ethereum as any)

      try {
        const current: number = await rpc.readContractData({
          contractABI,
          contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
          method: 'totalSupply',
          data: [],
        })

        setTotalSupply(Number(current))

        const max: number = await rpc.readContractData({
          contractABI,
          contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
          method: 'maxTokens',
          data: [],
        })

        setMaxSupply(Number(max))
      } catch (e) {
        console.log(e)
      }
    }

    if (!isLoaded) {
      getTotalSupply().catch(console.log)
      setIsLoaded(true)
    }
  }, [isLoaded])
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 z-3">
        <div className="h-32 rounded-lg lg:col-span-2">
          <div className="rounded-lg border border-gray-700 bg-orange-300 text-black p-4">
            <div className="text-lg font-bold">Mint your NOUS Bot</div>
            <div className="text-sm">Contract: {import.meta.env.VITE_NOUS_AI_NFT}</div>
            <PublicMintBox />
          </div>
        </div>
        <div className="h-32 rounded-lg flex flex-col gap-y-2">
          <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <div className="text-lg font-bold mb-4">Progress</div>
            <div className="flex justify-between text-sm">
              <span>{((supply / max) * 100).toFixed(2)}% minted</span>
              <span className="font-semibold">
                {supply}/{max}
              </span>
            </div>
            <div className="mt-1">
              <span id="ProgressLabel" className="sr-only">
                Supply
              </span>

              <span aria-labelledby="ProgressLabel" className="block rounded-full bg-yellow-100">
                <span
                  className="block h-4 pt-1 rounded-lg bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-orange-400 to-orange-500"
                  style={{ width: `${(supply / max) * 100 < 3 ? 3 : (supply / max) * 100}%` }}
                >
                  <span className="font-bold text-white"> </span>
                </span>
              </span>
            </div>
            <div className="mt-3 text-xs">Minting remains open while supplies last.</div>
          </div>
          {/* <TransactionMint /> */}
          {/* <TimelineMint /> */}
        </div>
      </div>
    </>
  )
}

export default PageMint
