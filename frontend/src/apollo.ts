import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'cross-fetch/polyfill'

export const client = new ApolloClient({
  ssrMode: typeof window == 'undefined',
  link: createHttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})
