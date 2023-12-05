import { Token } from 'lib/Perk'
import { ApolloClientFilter, apolloQuery } from './apollo'

export const getNftByAddress = async (address: string, skip: number, first: number) => {
  const query = `
    query GetTokenByAddress($address: String, $skip: Int, $first: Int) {
      tokens(where: { owner: $address }, skip: $skip, first: $first) {
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
    variables: { address, skip, first },
  })

  return res
}
