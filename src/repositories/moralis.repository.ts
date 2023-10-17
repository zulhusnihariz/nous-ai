import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from 'repositories'
import { Nft } from 'lib'
import { useApi } from 'hooks/use-api'

const useGetNftByWalletAddress = ({ address, chain }: { address: string; chain: string }) => {
  const { getNftsByWalletAddress } = useApi()

  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS, chain],
    queryFn: async ({ queryKey }) => {
      const [_rqKey, chain] = queryKey
      try {
        const response = await getNftsByWalletAddress(address, chain)

        const nfts = response.data.result.map(
          (d: { token_address: any; token_id: any; metadata: string; owner_of: string }) => {
            const meta = JSON.parse(d.metadata)
            if (meta?.image?.startsWith('ipfs://')) {
              meta.image = meta.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
            }

            return {
              token_address: d.token_address,
              token_id: d.token_id,
              chain_id: chain,
              metadata: meta,
              owner: d.owner_of,
            }
          }
        ) as Nft[]

        return nfts
      } catch (e) {
        console.log(e)
      }
      return []
    },
    enabled: Boolean(address),
  })
}

const useGetNftByContractAddress = (chain: string) => {
  const tokenAddress = import.meta.env.VITE_NOUS_AI_NFT
  const { getNftsByContractAddress } = useApi()

  return useQuery({
    queryKey: [RQ_KEY.GET_NFTS, chain, tokenAddress],
    queryFn: async ({ queryKey }) => {
      const [_rqKey, chain] = queryKey
      try {
        const response = await getNftsByContractAddress(tokenAddress, chain)

        const nfts = response.data.result.map(
          (d: { token_address: any; token_id: any; metadata: string; owner_of: string; minter_address: string }) => {
            const meta = JSON.parse(d.metadata)

            return {
              token_address: d.token_address,
              token_id: d.token_id,
              chain_id: chain,
              metadata: meta,
              owner: d.owner_of,
              minter: d.minter_address,
            }
          }
        ) as Nft[]

        return nfts
      } catch (e) {
        console.log(e)
      }
      return []
    },
    enabled: Boolean(chain),
  })
}

export { useGetNftByWalletAddress, useGetNftByContractAddress }
