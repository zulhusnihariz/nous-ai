import { useCallback, useState } from 'react'
import { useNousStore } from 'store'
import RPC from 'utils/ethers'

interface PurchaseButtonProps {
  perkId: String
  mintPrice: String
}

const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'perkId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProof',
        type: 'bytes32[]',
      },
    ],
    name: 'purchasePerk',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

const usePurchasePerk = ({ perkId, mintPrice }: PurchaseButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { selectedNous } = useNousStore()

  const purchasePerk = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const rpc = new RPC(window?.ethereum as any)
      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
        method: 'purchasePerk',
        data: [`${selectedNous?.token_id}`, `${perkId}`, [] as any],
        options: {
          value: mintPrice as string,
        },
      })
    } catch (error) {
      console.error('Error purchasing perk:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mintPrice, perkId, selectedNous])

  return { purchasePerk, isLoading, error }
}

export default usePurchasePerk
