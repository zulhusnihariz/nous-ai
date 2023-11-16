import { useEffect, useState } from 'react'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'

const contractABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]

interface Prop {
  dataKey: string
  tokenId: string
  walletAddress: string
}

const useCheckAccess = ({ dataKey, tokenId, walletAddress }: Prop) => {
  const [error, setError] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)

  const { data: pageAccess } = useGetLineageNousMetadata(
    dataKey,
    'access',
    import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as string,
    ''
  )

  useEffect(() => {
    const isOwner = async () => {
      setError(null)
      try {
        const rpc = new RPC(window?.ethereum as any)
        const address = await rpc.readContractData({
          contractABI,
          contractAddress: import.meta.env.VITE_NOUS_AI_NFT as string,
          method: 'ownerOf',
          data: [tokenId],
        })

        return address === walletAddress
      } catch (error) {
        console.error('Error check ownerOf:', error)
        return false
      }
    }

    const checkAccess = async () => {
      if (pageAccess === 'private') {
        setHasAccess(await isOwner())
      } else if (pageAccess === 'public') {
        setHasAccess(true)
      } else {
        setHasAccess(false)
      }
    }

    checkAccess().catch(console.log)
  }, [pageAccess, tokenId, walletAddress])

  return { hasAccess, error }
}

export default useCheckAccess
