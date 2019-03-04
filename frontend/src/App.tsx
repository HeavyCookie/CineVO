import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import './App.css'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { client } from './apollo'

const App = () => (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </ApolloHooksProvider>
  </ApolloProvider>
)

export default App
