import newsApiInstance from 'adapter/newsdata'

export const getLatestCryptoNews = () => {
  return newsApiInstance({
    method: 'GET',
    url: `/news/today`,
  })
}
