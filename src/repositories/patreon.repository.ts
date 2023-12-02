import { useQuery } from '@tanstack/react-query'
import { RQ_KEY } from 'repositories'
import { getNftsLatestPrice } from 'services/nft'
import { getPatreonTransaction, getUserPatreon } from 'services/patreon'

interface PricesMap {
  [tokenId: string]: number
}

const useGetTotalPatreonValue = (address: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_TOTAL_PATREON_VALUE, address],
    queryFn: async () => {
      const { data } = await getUserPatreon(address.toLowerCase())
      const patreonData = data.user.patreon

      const tokenIds = data.user.patreon.map(e => Number(e.tokenId))
      const { data: prices } = await getNftsLatestPrice(tokenIds)

      const pricesMap: PricesMap = prices.tokens.reduce((map: PricesMap, token) => {
        map[token.tokenId] = Number(token.latestPrice)
        return map
      }, {} as PricesMap)

      const totalValue = patreonData.reduce((total, patreon) => {
        const latestPrice = pricesMap[patreon.tokenId]
        return total + latestPrice * patreon.totalAmount
      }, 0)

      return totalValue
    },
    enabled: Boolean(address),
  })
}

const usePatreonTransactionByTokenId = (tokenId: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_PATREON_TX_BY_TOKEN_ID, tokenId],
    queryFn: async () => {
      const { data } = await getPatreonTransaction(tokenId)
      return data.transactions.map((e: any) => {
        return {
          activity: e.activity,
          address: e.address.id,
          amount: e.amount,
        }
      })
    },
    enabled: Boolean(tokenId),
  })
}

export { useGetTotalPatreonValue, usePatreonTransactionByTokenId }
