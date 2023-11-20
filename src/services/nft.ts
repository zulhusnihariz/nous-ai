import { Token } from 'lib/Perk'
import { ApolloClientFilter, apolloQuery } from './apollo'

export const getNftsByPage = async (variables?: ApolloClientFilter) => {
  const query = `
    query GetTokenByPage($first: Int, $skip: Int) {
      tokens(first: $first, skip: $skip) {
        id
        tokenId
        owner {
          id
        }
      }
    }
  `

  return apolloQuery<{ tokens: Token[] }>({
    query,
    variables,
  })
}
