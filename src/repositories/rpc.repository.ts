import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import rpc, { JSONRPCFilter, NftMetadata, Transaction, LitProtocolEncryption } from '../services/rpc'
import { useIpfs } from 'hooks/use-ipfs'
import { RQ_KEY } from 'repositories'
import { formatTokenKey } from 'utils'
import { Metadata } from 'lib'

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

export async function parseString(input: string): Promise<DataTypeMetadata | DataTypeNone | DataTypeMedia> {
  try {
    const parsed = JSON.parse(input)
    if (typeof parsed === 'object') return { type: 'metadata', data: parsed }
  } catch (e) {}

  try {
    const response = await fetch(input)
    const contentType = response.headers.get('content-type')
    if (contentType?.startsWith('image/')) return { type: 'image', data: input }
    if (contentType?.startsWith('audio/')) return { type: 'audio', data: input }
  } catch (e) {}

  return { type: 'none', data: input }
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
    onSuccess: async () => {
      let timeout: NodeJS.Timeout
      timeout = setTimeout(async () => {
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

type UseGetMetadatasReturnType = Record<
  string,
  {
    nft: NftMetadata & { version: string }
    lit_protocol: LitProtocolEncryption & { version: string }
    token: {
      address: string
      chain: string
      id: string
    }
  }
>
const useGetMetadatas = () => {
  return useQuery<UseGetMetadatasReturnType>({
    queryKey: [RQ_KEY.GET_METADATAS],
    queryFn: async () => {
      const result = await rpc.searchMetadatas({
        query: [
          {
            column: 'token_key',
            op: '=',
            query: formatTokenKey(import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN, import.meta.env.VITE_NOUS_AI_NFT),
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

          let { tokenId, alias, ...rest } = curr
          if (!prev[tokenId]) prev[tokenId] = {}

          if (alias === '') {
            prev[tokenId]['nft'] = rest
          } else {
            prev[tokenId][alias] = rest
          }

          return prev
        },
        {} as Record<string, any>
      )

      return reduced
    },
  })
}

export { useGetCompleteTransactions, useGetTransactions, usePublishTransaction, useStoreBlob, useGetMetadatas }
