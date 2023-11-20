import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useMinting = () => {
  const { address } = useConnectedWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const canMint = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const rpc = new RPC(window?.ethereum as any)
      const no = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
        method: 'balanceOf',
        data: [address.full],
      })

      return Number(no)
    } catch (error) {
      console.error('Error check minting eligiblity:', error)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  return { canMint, isLoading, error }
}

export default useMinting
