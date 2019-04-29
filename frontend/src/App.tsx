import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './modules/Home'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import { client } from './apollo'
import { DefaultView } from './components/DefaultView'
import { GlobalStyle } from './components/GlobalStyle'
import { Movie } from './modules/Movie'

import { IntlProvider, addLocaleData } from 'react-intl'
import frLocale from 'react-intl/locale-data/fr'
import { Unsubscribe } from './modules/Unsubscribe'

addLocaleData(frLocale)

const App = () => (
  <IntlProvider locale="fr">
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <GlobalStyle />
        <DefaultView>
          <Switch>
            <Route path="/unsubscribe/:uuid" component={Unsubscribe} />
            <Route path="/" component={Home} />
          </Switch>
          {/* Popins */}
          <Route path="/movies/:movieId" component={Movie} />
        </DefaultView>
      </ApolloHooksProvider>
    </ApolloProvider>
  </IntlProvider>
)

export default App
