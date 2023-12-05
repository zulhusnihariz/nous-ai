import { Token } from 'lib/Perk'
import { ApolloClientFilter, apolloQuery } from './apollo'

export const getNftByAddress = async (address: string, skip: number, limit: number) => {
  const query = `
    query GetTokenByAddress($address: String, $skip: Int, $limit: Int) {
      tokens(where: { owner: $address }, skip: $skip, limit: $limit) {
        id
        tokenId
        owner {
          id
        }
      }
    }
  `

  const res = apolloQuery<{ tokens: Token[] }>({
    query,
    variables: { address, skip, limit },
  })

  return res
}
