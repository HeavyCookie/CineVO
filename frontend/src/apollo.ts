import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'cross-fetch/polyfill'
import { getToken } from './context'

const httpLink = createHttpLink({
  uri:
    typeof window != 'undefined'
      ? window.location.origin + '/graphql'
      : process.env.BACKEND_URL || 'http://localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

export const client = new ApolloClient({
  ssrMode: typeof window == 'undefined',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
