import * as React from 'react'
import { Route } from 'react-router-dom'
import Home from './modules/Home'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { client } from './apollo'
import { DefaultView } from './components/DefaultView'
import { GlobalStyle } from './components/GlobalStyle'
import { Movie } from './modules/Movie'

const App = () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <GlobalStyle />
      <DefaultView>
        <Route path="/" component={Home} />
        <Route path="/movies/:movieId" component={Movie} />
      </DefaultView>
    </ApolloHooksProvider>
  </ApolloProvider>
)

export default App
