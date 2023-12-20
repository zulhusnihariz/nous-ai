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
        latestPrice
      }
    }
  `

  return apolloQuery<{ tokens: Token[] }>({
    query,
    variables,
  })
}

export const getNftsLatestPrice = async (tokenIds: number[]) => {
  const query = `
    query GetTokensLatestPrice($tokenIds: [Int!]) {
      tokens(where: { tokenId_in: $tokenIds }) {
        tokenId
        latestPrice
      }
    }
  `

  return apolloQuery<{ tokens: Token[] }>({
    query,
    variables: { tokenIds },
  })
}
export const getNftOwnerByTokenId = async (tokenId: string) => {
  const query = `
    query GetTokenByPage($id: String) {
      token(id: $id) {
        id
        tokenId
        owner {
          id
        }
      }
    }
  `

  return apolloQuery<{ token: Token }>({
    query,
    variables: { id: tokenId },
  })
}
