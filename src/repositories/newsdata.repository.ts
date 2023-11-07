import { useQuery } from '@tanstack/react-query'
import { News } from 'lib'
import { RQ_KEY } from 'repositories'
import { getLatestCryptoNews } from 'services/newsdata'

const useGetLatestCryptoNews = () => {
  return useQuery({
    queryKey: [RQ_KEY.GET_LATEST_CRYPTO_NEWS],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await getLatestCryptoNews()

        return response.data as News[]
      } catch (e) {
        console.log(e)
      }
      return []
    },
  })
}

export { useGetLatestCryptoNews }
