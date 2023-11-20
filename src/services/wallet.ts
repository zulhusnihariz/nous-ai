import { Token } from 'lib/Perk'
import { ApolloClientFilter, apolloQuery } from './apollo'

export const getNftByAddress = async (address: string) => {
  const query = `
    query GetTokenByAddress($address: String) {
      tokens(where: { owner: $address }) {
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
    variables: { address },
  })

  return res
}
