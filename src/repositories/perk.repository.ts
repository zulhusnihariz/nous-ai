import { useQuery } from '@tanstack/react-query'
import { ApolloClientFilter, apolloQuery } from 'services/apollo'
import { RQ_KEY } from 'repositories'
import { Perk } from 'lib/Perk'
import { ethers } from 'ethers'

const useGetPerks = (variables?: ApolloClientFilter) => {
  const query = `
  query Perks($first: Int, $skip: Int) {
    perks(first: $first, skip: $skip) {
      id
      title
      description
      price
    }
  }
  `
  return useQuery({
    queryKey: [RQ_KEY.GET_PERKS],
    queryFn: async () => {
      const { data } = await apolloQuery<{ perks: Perk[] }>({ query, variables })

      return data.perks.map(perk => {
        return {
          id: perk.id,
          title: perk.title,
          description: perk.description,
          price: ethers.formatEther(perk.price as any) as String,
          banner: 'https://nftstorage.link/ipfs/bafybeieh2ghkfaak7pbv5s6xmwmqpxdfytnbgr3tyjg5tkxt42sihdqfza' as String,
        }
      })
    },
  })
}

export { useGetPerks }
