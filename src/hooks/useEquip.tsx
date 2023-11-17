import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'

interface Props {
  perkId: string
  tokenId: string
}

const contractABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'perkId', type: 'uint256' },
    ],
    name: 'equip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const useEquipPerk = ({ perkId, tokenId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const equipPerk = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const rpc = new RPC(window?.ethereum as any)
      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
        method: 'equip',
        data: [Number(tokenId) as any, Number(perkId)],
        options: {
          value: '0',
        },
      })
    } catch (error: any) {
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [perkId, tokenId])

  return { equipPerk, isLoading, error }
}

export default useEquipPerk
