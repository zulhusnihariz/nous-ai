import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, Transaction } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { chainIdToNetwork, formatDataKey } from 'utils'
import { Nft, NftMetadata } from 'lib'
import { NousNft } from 'lib/NousNft'
import { getNftByAddress } from 'services/wallet'
import { getNftsByPage } from 'services/nft'

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

const createDefaultMetadata = (token_id: string) => {
  return {
    owner: '',
    token_address: import.meta.env.VITE_NOUS_AI_NFT as string,
    token_id,
    chain_id: import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
    dataKey: '',
    metadata: {
      name: '',
      image: '',
      description: '',
      attributes: [
        {
          trait_type: 'name',
          value: `BOT${token_id}`,
        },
      ],
      version: '',
    },
    stat: { level: '' },
    achievement: { badge: '' },
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

  const [result_metadata, result_nous_storage, result_nous_metadata, result_nous_level, result_badge] =
    await Promise.all([
      rpc.getMetadata(data_key, '0x01', import.meta.env.VITE_NOUS_METADATA_PK?.toLowerCase() as string, '', data_key),
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
      rpc.getMetadata(
        data_key,
        import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as String,
        import.meta.env.VITE_NOUS_DATA_PK as string,
        'bot_level',
        ''
      ),
      rpc.getMetadata(
        data_key,
        import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as String,
        import.meta.env.VITE_NOUS_DATA_PK as string,
        'badge',
        ''
      ),
    ])

  const [nous_storage_exists, nous_metadata_exists] = [
    result_nous_storage && result_nous_storage.length == 1,
    result_nous_metadata && result_nous_metadata.length == 1,
  ]

  const cid_metadata = result_metadata ? result_metadata.cid : ''
  const cid_nous_storage: string = nous_storage_exists ? result_nous_storage[0].cid : ''
  const cid_nous_metadata: string = nous_metadata_exists ? result_nous_metadata[0].cid : ''
  const cid_nous_level = result_nous_level ? result_nous_level.cid : ''
  const cid_nous_badge = result_badge ? result_badge.cid : ''

  const promises: any[] = [
    cid_metadata ? rpc.getContentFromIpfs(cid_metadata) : undefined,
    cid_nous_storage ? rpc.getContentFromIpfs(cid_nous_storage) : undefined,
    cid_nous_metadata ? rpc.getContentFromIpfs(cid_nous_metadata) : undefined,
    cid_nous_level ? rpc.getContentFromIpfs(cid_nous_level) : undefined,
    cid_nous_badge ? rpc.getContentFromIpfs(cid_nous_badge) : undefined,
  ]

  const result = await Promise.all(promises)
  return result
}

const useGetNousMetadatas = (public_key: string, page_index: number, item_per_page: number) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const nfts: (Nft & NousNft)[] = []

      const end_index = page_index * item_per_page + 10 <= 555 ? page_index * item_per_page + 10 : 555

      for (let x = page_index * item_per_page; x < end_index; x++) {
        const json = createDefaultMetadata(`${x}`)

        const [
          contentFromMetadata,
          contentFromNousStorage,
          contentFromNousMetadata,
          contentFromNousLevel,
          contentFromNousBadge,
        ] = await fetchNousMetadata(`${x}`, public_key)

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

        if (contentFromNousLevel) {
          const data = JSON.parse(contentFromNousLevel.data.result.content as string)
          json.stat = data.content as { level: string }
        }

        if (contentFromNousBadge) {
          const data = JSON.parse(contentFromNousBadge.data.result.content as string)
          json.achievement.badge = data.content.src as string
        }

        nfts.push(json)
      }

      return nfts
    },
    enabled: Boolean(public_key),
  })
}

const useGetOwnedNousMetadatas = (public_key: string) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS, public_key],
    queryFn: async () => {
      const { data } = await getNftByAddress(public_key.toLowerCase())

      const nfts: (Nft & NousNft)[] = []

      for (let i = 0; i < data.tokens.length; i++) {
        const token = data.tokens[i]
        const json = createDefaultMetadata(token.tokenId)

        const [
          contentFromMetadata,
          contentFromNousStorage,
          contentFromNousMetadata,
          contentFromNousLevel,
          contentFromNousBadge,
        ] = await fetchNousMetadata(token.tokenId, public_key)

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

        if (contentFromNousLevel) {
          const data = JSON.parse(contentFromNousLevel.data.result.content as string)
          json.stat.level = data.content.level as string
        }

        if (contentFromNousBadge) {
          const data = JSON.parse(contentFromNousBadge.data.result.content as string)
          json.achievement.badge = data.content.src as string
        }

        nfts.push(json)
      }

      return nfts
    },
    enabled: Boolean(public_key),
  })
}

const useGetAllBots = (size: number, page: number) => {
  return useQuery<({ dataKey: string } & Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_ALL_NFTS],
    queryFn: async () => {
      const nfts: ({ dataKey: string } & Nft & NousNft)[] = []

      // const res = await getNftsByContractAddress(
      //   import.meta.env.VITE_NOUS_AI_NFT as string,
      //   chainIdToNetwork(import.meta.env.VITE_DEFAULT_CHAIN_ID as string)
      // )

      const { data } = await getNftsByPage({ first: size, skip: size * page })

      const tokenIds = data.tokens.map((nft: any) => nft.tokenId)

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i]
        const json = createDefaultMetadata(tokenId)

        const [
          contentFromMetadata,
          contentFromNousStorage,
          contentFromNousMetadata,
          contentFromNousLevel,
          contentFromNousBadge,
        ] = await fetchNousMetadata(tokenId as string, import.meta.env.VITE_NOUS_METADATA_PK as string)

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

        if (contentFromNousLevel) {
          const data = JSON.parse(contentFromNousLevel.data.result.content as string)
          json.stat.level = data.content.level as string
        }

        if (contentFromNousBadge) {
          const data = JSON.parse(contentFromNousBadge.data.result.content as string)
          json.achievement.badge = data.content.src as string
        }

        json.dataKey = formatDataKey(
          import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
          import.meta.env.VITE_NOUS_AI_NFT as string,
          tokenId as string
        )

        nfts.push(json)
      }

      return nfts
    },
  })
}

const useGetSingleNousMetadata = (data_key: string) => {
  return useQuery<NousNft>({
    queryKey: [RQ_KEY.GET_METADATAS, data_key],
    queryFn: async () => {
      const json = createDefaultMetadata('')

      const [result_nous, result_metadata] = await Promise.all([
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
              query: import.meta.env.VITE_NOUS_METADATA_PK.toLowerCase() as string,
            },
          ],
        }),
        rpc.getMetadata(
          data_key,
          import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID as String,
          import.meta.env.VITE_NOUS_METADATA_PK.toLowerCase() as String,
          '',
          data_key
        ),
      ])

      const needToLoadFromIpfs = [
        result_nous && result_nous.length == 1 ? rpc.getContentFromIpfs(result_nous[0].cid) : undefined,
        result_metadata && result_metadata?.cid ? rpc.getContentFromIpfs(result_metadata.cid) : undefined,
      ]

      const [nous_ipfs, metadata_ipfs] = await Promise.all(needToLoadFromIpfs)

      if (nous_ipfs) {
        const data = JSON.parse(nous_ipfs.data.result.content as string)
        json.nous = data.content
      }

      if (metadata_ipfs) {
        const data = JSON.parse(metadata_ipfs.data.result.content as string)
        json.metadata = data.content
      }

      return json
    },
    enabled: data_key !== '',
  })
}

/**
 * Retrieve metadata of NFT at Lineage 0x01 registry
 * @param data_key lineage data key
 * @returns nft metadata following ERC721 or ERC1155 format
 */
const useGetNftMetadata = (data_key: string) => {
  return useQuery<any>({
    queryKey: [RQ_KEY.GET_NFT_METADATA, data_key],
    queryFn: async () => {
      const nft_metadata = await rpc.getMetadata(
        data_key,
        import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID as String,
        import.meta.env.VITE_NOUS_METADATA_PK.toLowerCase() as String,
        '',
        ''
      )

      const content = await rpc.getContentFromIpfs(nft_metadata.cid)
      return JSON.parse(content.data.result.content as string)
    },
    enabled: Boolean(data_key),
  })
}

const useGetLineageNousMetadata = (data_key: string, alias: string, public_key: string, version: string) => {
  return useQuery<any>({
    queryKey: [RQ_KEY.GET_LINEAGE_NOUS_METADATA, data_key, alias],
    queryFn: async () => {
      const metadata = await rpc.getMetadata(
        data_key,
        import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as String,
        public_key,
        alias,
        version
      )

      if (!metadata.cid) {
        return null
      }

      const content = await rpc.getContentFromIpfs(metadata.cid)
      return JSON.parse(content.data.result.content as string)
    },
    enabled: data_key !== '',
  })
}

const useGetLineageNftToken = (data_key: string) => {
  return useQuery<any>({
    queryKey: [RQ_KEY.GET_LINEAGE_NFT_TOKEN, data_key],
    queryFn: async () => {
      const metadata = await rpc.getMetadata(
        data_key,
        import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID as String,
        import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID.toLowerCase() as String,
        'token',
        data_key
      )

      const content = await rpc.getContentFromIpfs(metadata.cid)

      return JSON.parse(content.data.result.content as string)
    },
    enabled: data_key !== '',
  })
}

export {
  useGetCompleteTransactions,
  useGetTransactions,
  usePublishTransaction,
  useGetOwnedNousMetadatas,
  useGetSingleNousMetadata,
  useGetNousMetadatas,
  useGetNftMetadata,
  useGetAllBots,
  useGetLineageNousMetadata,
  useGetLineageNftToken,
}
