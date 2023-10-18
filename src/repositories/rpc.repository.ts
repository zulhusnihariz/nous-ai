import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, NftMetadata, Transaction, NousMetadata } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { formatDataKey } from 'utils'
import { Nft } from 'lib'
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

const createDefaultMetadata = (token_id: string) => {
  return {
    owner: '',
    token_address: import.meta.env.VITE_NOUS_AI_NFT as string,
    token_id,
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
      id: token_id,
    },
  }
}

const fetchNousMetadata = async (token_id: string, public_key: string) => {
  const data_key = formatDataKey(
    import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
    import.meta.env.VITE_NOUS_AI_NFT as string,
    token_id
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

  return await Promise.all(promises)
}

const useGetNousMetadatas = (public_key: string, page_index: number, item_per_page: number) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const nfts: (Nft & NousNft)[] = []

      const end_index = page_index * item_per_page + 10 <= 555 ? page_index * item_per_page + 10 : 555

      for (let x = page_index * item_per_page; x < end_index; x++) {
        const json = createDefaultMetadata(`${x}`)

        const [contentFromMetadata, contentFromNousStorage, contentFromNousMetadata] = await fetchNousMetadata(
          `${x}`,
          public_key
        )

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

const useGetOwnedNousMetadatas = (public_key: string, tokenIds: string[]) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const nfts: (Nft & NousNft)[] = []

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]
        const json = createDefaultMetadata(tokenId)

        const [contentFromMetadata, contentFromNousStorage, contentFromNousMetadata] = await fetchNousMetadata(
          tokenId,
          public_key
        )

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
    enabled: Boolean(public_key) && tokenIds.length > 0,
  })
}

const useGetSingleNousMetadata = (data_key: string, token_id: string) => {
  return useQuery<NousNft>({
    queryKey: [RQ_KEY.GET_METADATAS, data_key],
    queryFn: async () => {
      const json = createDefaultMetadata(token_id)

      const metadata = await rpc.searchMetadatas({
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
        ],
      })

      const cid = metadata && metadata.length == 1 ? metadata[0].cid : ''

      let contentFromNousMetadata = await rpc.getContentFromIpfs(cid)

      if (contentFromNousMetadata) {
        const data = JSON.parse(contentFromNousMetadata.data.result.content as string)
        json.nous = data.content
      }

      return json
    },
    enabled: Boolean(data_key) && Boolean(token_id),
  })
}

export {
  useGetCompleteTransactions,
  useGetTransactions,
  usePublishTransaction,
  useStoreBlob,
  useGetOwnedNousMetadatas,
  useGetSingleNousMetadata,
  useGetNousMetadatas,
}
