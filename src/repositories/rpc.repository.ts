import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, NftMetadata, Transaction, NousMetadata } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { formatDataKey, formatTokenKey } from 'utils'
import { Metadata, Nft } from 'lib'
import { useGetNftByContractAddress } from './moralis.repository'

const useGetCompleteTransactions = () => {
  return useQuery({
    queryKey: [RQ_KEY.GET_COMPLETED_TXS],
    queryFn: async () => {
      return await rpc.getCompleteTransactions()
    },
    retry: false,
  })
}

export type DataTypeMetadata = {
  type: 'metadata'
  data: NftMetadata
}

export type DataTypeMedia = {
  type: 'image' | 'audio'
  data: string
}

export type DataTypeNone = {
  type: 'none'
  data: string
}

const useGetTransactions = (data: JSONRPCFilter<Transaction> & { address?: `0x${string}` | undefined }) => {
  const { address, ...filter } = data

  return useQuery({
    queryKey: [RQ_KEY.GET_TXS],
    queryFn: async () => {
      return await rpc.getTransactions(filter)
    },
  })
}

const usePublishTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Transaction) => {
      return await rpc.publish(data)
    },
    onSuccess: () => {
      const timeout: NodeJS.Timeout = setTimeout(async () => {
        await queryClient.invalidateQueries([RQ_KEY.GET_METADATAS])
        if (timeout) clearTimeout(timeout)
      }, 5000)
    },
  })
}

const useStoreBlob = () => {
  const { ipfs } = useIpfs()

  return useMutation({
    mutationFn: async (blob: Blob) => {
      const resp = await ipfs?.storeBlob(blob)
      const url = `${import.meta.env.VITE_IPFS_NFT_STORAGE_URL}/${resp}`
      return url
    },
  })
}

type NousNft = {
  metadata: NftMetadata & { version: string }
  knowledge: string[]
  nous: NousMetadata & { version: string }
  token: {
    address: string
    chain: string
    id: string
  }
}

const useGetNousMetadatas = (public_key: string, page_index: number, item_per_page: number) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const nfts: (Nft & NousNft)[] = []

      const end_index = page_index * item_per_page + 10 <= 555 ? page_index * item_per_page + 10 : 555

      for (let x = page_index * item_per_page; x < end_index; x++) {
        const json = {
          owner: '',
          token_address: import.meta.env.VITE_NOUS_AI_NFT as string,
          token_id: x,
          chain_id: import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
          metadata: {
            name: '',
            image: '',
            description: '',
            attributes: [
              {
                trait_type: 'name',
                value: '',
              },
              {
                trait_type: 'personality',
                value: '',
              },
            ],
            version: '',
          },
          knowledge: [] as any,
          nous: {
            version: '',
          } as any,
          token: {
            address: import.meta.env.VITE_NOUS_AI_NFT as string,
            chain: import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
            id: `${x}`,
          },
        }

        const data_key = formatDataKey(
          import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
          import.meta.env.VITE_NOUS_AI_NFT as string,
          `${x}`
        )

        const [result_metadata, result_nous_storage, result_nous_metadata] = await Promise.all([
          rpc.searchMetadatas({
            query: [
              {
                column: 'data_key',
                op: '=',
                query: data_key,
              },
              {
                column: 'meta_contract_id',
                op: '=',
                query: '0x01',
              },
              {
                column: 'public_key',
                op: '=',
                query: public_key.toLowerCase(),
              },
            ],
          }),
          rpc.searchMetadatas({
            query: [
              {
                column: 'data_key',
                op: '=',
                query: data_key,
              },
              {
                column: 'meta_contract_id',
                op: '=',
                query: import.meta.env.VITE_NOUS_STORAGE_META_CONTRACT_ID as string,
              },
              {
                column: 'public_key',
                op: '=',
                query: public_key.toLowerCase(),
              },
            ],
          }),
          rpc.searchMetadatas({
            query: [
              {
                column: 'data_key',
                op: '=',
                query: data_key,
              },
              {
                column: 'meta_contract_id',
                op: '=',
                query: import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as string,
              },
              {
                column: 'public_key',
                op: '=',
                query: public_key.toLowerCase(),
              },
            ],
          }),
        ])

        let [metadata_exists, nous_storage_exists, nous_metadata_exists] = [
          result_metadata && result_metadata.length == 1,
          result_nous_storage && result_nous_storage.length == 1,
          result_nous_metadata && result_nous_metadata.length == 1,
        ]

        const cid_metadata: string = metadata_exists ? result_metadata[0].cid : ''
        const cid_nous_storage: string = nous_storage_exists ? result_nous_storage[0].cid : ''
        const cid_nous_metadata: string = nous_metadata_exists ? result_nous_metadata[0].cid : ''

        const promises: any[] = [
          cid_metadata ? rpc.getContentFromIpfs(cid_metadata) : undefined,
          cid_nous_storage ? rpc.getContentFromIpfs(cid_nous_storage) : undefined,
          cid_nous_metadata ? rpc.getContentFromIpfs(cid_nous_metadata) : undefined,
        ]

        const [contentFromMetadata, contentFromNousStorage, contentFromNousMetadata] = await Promise.all(promises)

        if (contentFromMetadata) {
          const data = JSON.parse(contentFromMetadata.data.result.content as string)
          json.metadata = data.content
        }

        if (contentFromNousStorage) {
          const data = JSON.parse(contentFromNousStorage.data.result.content as string)
          json.knowledge = data.content
        }

        if (contentFromNousMetadata) {
          const data = JSON.parse(contentFromNousMetadata.data.result.content as string)
          json.nous = data.content
        }

        nfts.push(json)
      }

      return nfts
    },
    enabled: Boolean(public_key),
  })
}

const useGetNousNfts = (chain: string) => {
  const { data: nfts } = useGetNftByContractAddress(chain)

  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const result = await rpc.searchMetadatas({
        query: [
          {
            column: 'token_key',
            op: '=',
            query: formatTokenKey(
              import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN as string,
              import.meta.env.VITE_NOUS_AI_NFT as string
            ),
          },
          {
            column: 'public_key',
            op: '=',
            query: import.meta.env.VITE_NOUS_LINEAGE_PK,
          },
        ],
        ordering: [{ column: 'token_id', sort: 'asc' }],
      })

      const promises = result?.map(async (curr: Metadata) => {
        if (curr.alias === 'lineage_key') return

        const res = await rpc.getContentFromIpfs(curr.cid)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          ...data,
          tokenId: curr.token_id,
          alias: curr.alias,
          version: curr.version,
        }
      })

      const results = await Promise.all(promises)

      const reduced = results.reduce(
        (prev, curr) => {
          if (curr === undefined) return prev

          const { tokenId, alias, ...rest } = curr
          if (!prev[tokenId]) prev[tokenId] = {}

          if (alias === '') {
            prev[tokenId]['metadata'] = rest
          } else {
            prev[tokenId][alias] = rest
          }

          return prev
        },
        {} as Record<string, any>
      )

      const totalNft = nfts?.length ?? 0
      const res: (Nft & NousNft)[] = []

      for (let i = 0; i < totalNft; i++) {
        const nft = { ...nfts?.[i], ...reduced[i + 1] }
        res.push(nft)
      }

      console.log(res)

      return res
    },
    enabled: Boolean(nfts && nfts?.length > 0),
  })
}

const useGetSingleNousNft = (nftKey: string) => {
  return useQuery<NousNft>({
    queryKey: [RQ_KEY.GET_METADATAS, nftKey],
    queryFn: async () => {
      const result = await rpc.searchMetadatas({
        query: [
          {
            column: 'token_key',
            op: '=',
            query: formatTokenKey(import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN, import.meta.env.VITE_NOUS_AI_NFT),
          },
          {
            column: 'data_key',
            op: '=',
            query: nftKey,
          },
        ],
      })

      const promises = result?.map(async (curr: Metadata) => {
        if (curr.alias === 'lineage_key') return

        const res = await rpc.getContentFromIpfs(curr.cid)
        const content = JSON.parse(res.data.result.content as string)
        const data = content.content as { text: string; image: string }

        return {
          ...data,
          tokenId: curr.token_id,
          alias: curr.alias,
          version: curr.version,
        }
      })

      const results = await Promise.all(promises)

      const reduced = results.reduce(
        (prev, curr) => {
          if (curr === undefined) return prev

          const { tokenId, alias, ...rest } = curr
          if (!prev[tokenId]) prev[tokenId] = {}

          if (alias === '') {
            prev[tokenId]['metadata'] = rest
          } else {
            prev[tokenId][alias] = rest
          }

          return prev
        },
        {} as Record<string, any>
      )

      return Object.values(reduced)[0] as NousNft
    },
  })
}

export {
  useGetCompleteTransactions,
  useGetTransactions,
  usePublishTransaction,
  useStoreBlob,
  useGetNousNfts,
  useGetSingleNousNft,
  useGetNousMetadatas,
}
