import { User } from 'lib/User'
import { apolloQuery } from './apollo'
import { PatreonTransaction } from 'lib/PatreonTransaction'

export const getUserPatreon = async (address: string) => {
  const query = `
    query GetUserPatreonData($address: String!) {
      user(id: $address) {
        id
        patreon {
          tokenId
          totalAmount
        }
      }
    }
  `

  return apolloQuery<{ user: User }>({
    query,
    variables: { address },
  })
}

export const getPatreonTransaction = async (tokenId: string) => {
  const query = `
    query GetUserPatreonData($tokenId: String!) {
      transactions(first: 8, where: { tokenId: $tokenId}) {
        activity
        amount
        address {
          id
        }
      }
    }
  `

  return apolloQuery<{ transactions: PatreonTransaction[] }>({
    query,
    variables: { tokenId },
  })
}
