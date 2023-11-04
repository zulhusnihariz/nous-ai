import newsApiInstance from 'adapter/newsdata'

export const getLatestCryptoNews = () => {
  return newsApiInstance({
    method: 'GET',
    url: `/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&language=en&full_content=1&category=world`,
  })
}
