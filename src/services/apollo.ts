import { gql, OperationVariables, QueryOptions } from '@apollo/client'
import apolloClientInstance from 'adapter/apollo'
import { Perk, Token } from 'lib/Perk'

export type ApolloClientResponse<T> = {
  data: T
  loading: boolean
  networkStatus: number
}

export type ApolloClientFilter = {
  first?: number
  skip?: number
  where?: { to?: string; from: string }
}

export const apolloQuery = async <R>(
  options: Omit<QueryOptions<OperationVariables, any>, 'query'> & { query: string }
) => {
  const { query, variables } = options
  return (await apolloClientInstance.query({ query: gql(query), variables })) as ApolloClientResponse<R>
}

export const getPerkById = async (perkId: number) => {
  const query = `
    query Perk($perkId: Int) {
      perk(id: $perkId) {
        id
        title
        description
        price
      }
    }
  `

  return apolloQuery<{ perk: Perk }>({
    query,
    variables: { perkId },
  })
}

export const getPerksByTokenId = async (tokenId: number) => {
  const query = `
    query PerksByTokenId($tokenId: String) {
      token(id: $tokenId) {
        tokenPerks {
          perk {
            id
            title
            description
            cid
            price
            forSale
            isPrivate
            isActivable
            isRepurchaseable
          }
        }
      }
    }
  `
  return apolloQuery<{ token: Token }>({
    query,
    variables: { tokenId: `${tokenId}` },
  })
}
