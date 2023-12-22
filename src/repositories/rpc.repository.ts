import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, Transaction } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { chainIdToNetwork, formatDataKey } from 'utils'
import { Metadata, Nft, NftMetadata } from 'lib'
import { NousNft } from 'lib/NousNft'
import { getNftByAddress } from 'services/wallet'
import { getNftOwnerByTokenId, getNftsByPage } from 'services/nft'
import { Token } from 'lib/Perk'

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
    latestPrice: 0,
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
    builder: {
      name: '',
      description: '',
      category: '',
      instructions: '',
      conversationStarters: [''],
    },
  }
}

enum NOUS_DATA {
  OPENSEA_METADATA = 'metadata',
  STORAGE = 'storage',
  NOUS_METADATA = 'nous',
  LEVEL = 'stat',
  BADGE = 'achievement',
  BUILDER = 'builder',
}

const getMetadataContent = async (
  data_key: string,
  meta_contract_id: string = import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID,
  public_key: string,
  alias: string,
  version = ''
) => {
  const metadata = await rpc.getMetadata(data_key, meta_contract_id, public_key, alias, version)

  if (!metadata?.cid) return undefined

  const content = await rpc.getContentFromIpfs(metadata.cid)
  return JSON.parse(content.data.result.content as string)
}

const searchMetadatasContent = async (filter: Partial<JSONRPCFilter<Metadata>>) => {
  const metadata = await rpc.searchMetadatas(filter)

  const exists = metadata && metadata.length == 1
  if (!exists) return undefined

  const content = await rpc.getContentFromIpfs(metadata[0].cid)
  return JSON.parse(content.data.result.content as string)
}

const fetchNousMetadata = async (
  token_id: string,
  public_key: string,
  owner_pk: string,
  include: Partial<Record<NOUS_DATA, boolean>>
) => {
  const data_key = formatDataKey(
    import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
    import.meta.env.VITE_NOUS_AI_NFT as string,
    token_id
  )

  let queries: Record<NOUS_DATA, () => Promise<any>> = {
    [NOUS_DATA.OPENSEA_METADATA]: () =>
      getMetadataContent(
        data_key,
        '0x01',
        import.meta.env.VITE_NOUS_METADATA_PK?.toLowerCase() as string,
        '',
        data_key
      ),
    [NOUS_DATA.STORAGE]: () =>
      searchMetadatasContent({
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
    [NOUS_DATA.NOUS_METADATA]: () =>
      searchMetadatasContent({
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
    [NOUS_DATA.LEVEL]: () =>
      getMetadataContent(
        data_key,
        import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as string,
        import.meta.env.VITE_NOUS_DATA_PK as string,
        'bot_level',
        ''
      ),
    [NOUS_DATA.BADGE]: () =>
      getMetadataContent(
        data_key,
        import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as string,
        import.meta.env.VITE_NOUS_DATA_PK as string,
        'badge',
        ''
      ),
    [NOUS_DATA.BUILDER]: () =>
      getMetadataContent(data_key, import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID as string, owner_pk, 'builder', ''),
  }

  const reduced = Object.entries(include).reduce(
    (acc, curr) => {
      const [key, value] = curr
      if (value) acc[key as NOUS_DATA] = queries[key as NOUS_DATA]
      return acc
    },
    {} as Record<NOUS_DATA, () => Promise<any>>
  )

  let fulfilled = await Promise.all(Object.values(reduced).map(func => func()))

  const results: Record<string, any> = {}

  Object.keys(reduced).forEach((key, index) => {
    results[key] = fulfilled[index]
  })

  return results
}

const useGetNousMetadatas = (public_key: string, page_index: number, item_per_page: number) => {
  return useQuery<(Nft & NousNft)[]>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const nfts: (Nft & NousNft)[] = []

      const end_index = page_index * item_per_page + 10 < 10000 ? page_index * item_per_page + 10 : 10000

      for (let x = page_index * item_per_page; x < end_index; x++) {
        const json = createDefaultMetadata(`${x}`)
        json.dataKey = formatDataKey(json.chain_id, json.token_address, json.token_id)

        const { metadata, storage, nous, stat, achievement } = await fetchNousMetadata(`${x}`, public_key, json.owner, {
          metadata: true,
          storage: true,
          nous: true,
          stat: true,
          achievement: true,
        })

        if (metadata) json.metadata = metadata.content
        if (storage) json.knowledge = storage.content
        if (nous) json.nous = nous.content
        if (stat) json.stat.level = stat.content.level
        if (achievement) json.achievement.badge = achievement.content.src

        nfts.push(json)
      }

      return nfts
    },
    enabled: Boolean(public_key),
  })
}

const useGetOwnedNousMetadatas = (public_key: string, size = 1000) => {
  return useInfiniteQuery<{ data: (Nft & NousNft)[]; nextCursor: number }>({
    queryKey: [RQ_KEY.GET_METADATAS, public_key],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await getNftByAddress(public_key.toLowerCase(), pageParam, size)

      const nfts: (Nft & NousNft)[] = []

      for (let i = 0; i < data.tokens.length; i++) {
        const token = data.tokens[i]
        const json = createDefaultMetadata(token.tokenId)
        json.dataKey = formatDataKey(json.chain_id, json.token_address, json.token_id)
        json.owner = data.tokens[i].owner.id

        const { metadata, storage, nous, stat, achievement, builder } = await fetchNousMetadata(
          token.tokenId,
          public_key,
          json.owner,
          {
            metadata: true,
            storage: true,
            nous: true,
            stat: true,
            achievement: true,
            builder: true,
          }
        )

        if (metadata) json.metadata = metadata.content
        if (storage) json.knowledge = storage.content
        if (nous) json.nous = nous.content
        if (stat) json.stat.level = stat.content.level
        if (achievement) json.achievement.badge = achievement.content.src
        if (builder) json.builder = builder.content

        nfts.push(json)
      }

      return { data: nfts, nextCursor: pageParam + size }
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    keepPreviousData: true,
    enabled: Boolean(public_key),
  })
}

const loadBots = async (data: { tokens: Token[] }, tokenIds: any[], i: number) => {
  const tokenId = tokenIds[i]
  const json = createDefaultMetadata(tokenId)
  json.dataKey = formatDataKey(json.chain_id, json.token_address, json.token_id)
  json.owner = data.tokens[i].owner.id
  json.latestPrice = data.tokens[i].latestPrice

  const { builder } = await fetchNousMetadata(
    tokenId as string,
    import.meta.env.VITE_NOUS_METADATA_PK as string,
    json.owner,
    {
      builder: true,
    }
  )

  if (!builder) return json

  const { metadata, achievement } = await fetchNousMetadata(
    tokenId as string,
    import.meta.env.VITE_NOUS_METADATA_PK as string,
    json.owner,
    {
      metadata: true,
      achievement: true,
    }
  )

  if (metadata) json.metadata = metadata.content
  if (achievement) json.achievement.badge = achievement.content.src as string
  if (builder) json.builder = builder.content

  json.dataKey = formatDataKey(
    import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
    import.meta.env.VITE_NOUS_AI_NFT as string,
    tokenId as string
  )

  return json
}

const useGetAllBots = (size: number) => {
  return useInfiniteQuery<{ data: ({ dataKey: string } & Nft & NousNft)[]; nextCursor: number }>({
    queryKey: [RQ_KEY.GET_ALL_NFTS],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await getNftsByPage({ skip: pageParam, first: size })

      const tokenIds = data.tokens.map((nft: any) => nft.tokenId)
      const promises = []

      for (let i = 0; i < tokenIds.length; i++) {
        promises.push(loadBots(data, tokenIds, i))
      }

      const nfts: ({ dataKey: string } & Nft & NousNft)[] = await Promise.all(promises)

      return { data: nfts, nextCursor: pageParam + size }
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    keepPreviousData: true,
  })
}

const useGetSingleNousMetadata = (data_key: string) => {
  return useQuery<Nft & NousNft>({
    queryKey: [RQ_KEY.GET_METADATAS, data_key],
    queryFn: async () => {
      const json = createDefaultMetadata('')

      const [result_nous, result_metadata, result_nft_token] = await Promise.all([
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
        rpc.getMetadata(
          data_key,
          import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID as String,
          import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID.toLowerCase() as String,
          'token',
          data_key
        ),
      ])

      const needToLoadFromIpfs = [
        result_nous && result_nous.length == 1 ? rpc.getContentFromIpfs(result_nous[0].cid) : undefined,
        result_metadata && result_metadata?.cid ? rpc.getContentFromIpfs(result_metadata.cid) : undefined,
        result_nft_token && result_nft_token?.cid ? rpc.getContentFromIpfs(result_nft_token.cid) : undefined,
      ]

      const [nous_ipfs, metadata_ipfs, nft_token_ipfs] = await Promise.all(needToLoadFromIpfs)

      if (nous_ipfs) {
        const data = JSON.parse(nous_ipfs.data.result.content as string)
        json.nous = data.content
      }

      if (metadata_ipfs) {
        const data = JSON.parse(metadata_ipfs.data.result.content as string)
        json.metadata = data.content
      }

      if (nft_token_ipfs) {
        const data = JSON.parse(nft_token_ipfs.data.result.content as string)
        json.token = data.content

        const res = await getNftOwnerByTokenId(json.token.id)
        json.owner = res.data.token.owner.id
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

      if (!metadata?.cid) {
        return null
      }

      const content = await rpc.getContentFromIpfs(metadata.cid)
      return JSON.parse(content.data.result.content as string)
    },
    enabled: data_key !== '' && public_key !== undefined,
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
