import { Token } from 'lib/Perk'
import { apolloQuery } from './apollo'

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

  return apolloQuery<{ tokens: Token[] }>({
    query,
    variables: { address: address.toLowerCase() },
  })
}
