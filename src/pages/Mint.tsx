import PublicMintBox from 'components/Mint/PublicMintBox'
import WhitelistMintBox from 'components/Mint/WhitelistMintBox'
import TimelineMint from 'components/Mint/TimelineMint'
import TransactionMint from 'components/Mint/TransactionMint'
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
  const [isCompleted, setIsCompleted] = useState(true)
  

  useEffect(() => {
    if (Number(((supply / max) * 100).toFixed(2)) === 100.0) {
      setIsCompleted(true)
    } else {
      setIsCompleted(false)
    }
  }, [supply, max])


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

        if (Number.isFinite(current)) {
          setTotalSupply(Number(current))
        } else {
          setTotalSupply(0)
        }

        const max: number = await rpc.readContractData({
          contractABI,
          contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
          method: 'maxTokens',
          data: [],
        })

        if (Number.isFinite(max)) {
          setMaxSupply(Number(max))
        } else {
          setMaxSupply(0)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const handleAccountChange = () => {
      setIsLoaded(false)
    }

    if (!isLoaded) {
      getTotalSupply()
        .then(() => setIsLoaded(true))
        .catch(console.log)
      setIsLoaded(true)
    }

    window?.ethereum?.on('accountsChanged', handleAccountChange)
    return () => window?.ethereum?.removeListener('accountsChanged', handleAccountChange)
  }, [isLoaded])

  const handleLink = () => {
    if (import.meta.env.VITE_DEFAULT_CHAIN_ID === '80001') {
      return 'https://mumbai.polygonscan.com/address/0xC1ff59a4fBA0D0a26c0A84b9A11831E1488366b4#code' as string
    } else if (import.meta.env.VITE_DEFAULT_CHAIN_ID === '1') {
      return 'https://etherscan.io/' as string
    }
  }

  const handleNaNValue = () => {
    if (supply === 0 || max === 0) {
      return '0'
    } else {
      return `${((supply / max) * 100).toFixed(2)}`
    }
  }

  return (
    <>
      <div className=" p-1 md:px-2 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className=" rounded-lg lg:col-span-2">
          <div className="rounded-lg border border-gray-700 bg-orange-300 text-black p-4">
            <div className="text-lg font-bold">Mint your NOUS Bot</div>
            <div className="text-sm">
              Contract:{' '}
              <a
                href={handleLink()}
                target="_blank"
                rel="noreferrer noopener"
                className="text-orange-500 hover:text-orange-100 underline"
              >
                {import.meta.env.VITE_NOUS_AI_NFT}
              </a>
            </div>
            <PublicMintBox isCompleted={isCompleted} />
            <WhitelistMintBox />
          </div>

         
          
        </div>
        <div className="flex flex-col gap-3">
          <div className=" rounded-lg">
            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
              <div className="text-lg font-bold mb-4">Progress</div>
              <div className="flex justify-between text-sm">
                <span>{isCompleted ? 'SOLD OUT' : `${handleNaNValue()}% minted`}</span>
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
                    style={{ width: `${(supply / max) * 100}%` }}
                  >
                    <span className="font-bold text-white"> </span>
                  </span>
                </span>
              </div>
              <div className="mt-3 text-xs">Minting remains open while supplies last.</div>
            </div>
          </div>
          <TransactionMint />
          <TimelineMint />
          
        </div>
      </div>
    </>
  )
}

export default PageMint
