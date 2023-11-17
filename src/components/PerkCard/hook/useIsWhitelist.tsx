import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'

interface Prop {
  perkId: String
}

const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'perkId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]',
      },
    ],
    name: 'isWhitelistedForPerk',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const useIsWhitelisted = ({ perkId }: Prop) => {
  const { address } = useConnectedWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const isWhitelistedForPerk = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const rpc = new RPC(window?.ethereum as any)
      return await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
        method: 'isWhitelistedForPerk',
        data: [`${perkId}`, `${address.full}`, [] as any],
      })
    } catch (error) {
      console.error('Error purchasing perk:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isWhitelistedForPerk, isLoading, error }
}

export default useIsWhitelisted
