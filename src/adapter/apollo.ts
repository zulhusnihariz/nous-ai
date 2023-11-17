import { ApolloClient, InMemoryCache } from '@apollo/client'

export const instance = new ApolloClient({
  uri: import.meta.env.VITE_SUBGRAPH_PERK_URL,
  cache: new InMemoryCache(),
})

export default instance
