import { Perk } from 'lib/Perk'
import { useCallback, useState } from 'react'
import { useNousStore } from 'store'
import RPC from 'utils/ethers'

interface PurchaseButtonProps {
  perk: Perk
  mintPrice: String
}

const contractABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'perkId', type: 'uint256' },
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

const usePurchasePerk = ({ perk, mintPrice }: PurchaseButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { selectedNous } = useNousStore()

  const purchasePerk = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const price = mintPrice === '0.0' ? `0` : mintPrice
    try {
      const rpc = new RPC(window?.ethereum as any)
      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
        method: 'purchasePerk',
        data: [Number(selectedNous?.token_id), Number(perk.id), [] as any],
        options: {
          value: price as string,
        },
      })
    } catch (error) {
      console.error('Error purchasing perk:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mintPrice, perk, selectedNous])

  return { purchasePerk, isLoading, error }
}

export default usePurchasePerk
