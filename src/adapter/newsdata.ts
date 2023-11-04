import axios from 'axios'

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_NEWS_API}`,
})

export default instance
