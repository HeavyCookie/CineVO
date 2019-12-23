import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'

import Home from './modules/Home'
import { client } from './apollo'
import { DefaultView } from './components/DefaultView'
import { GlobalStyle } from './components/GlobalStyle'
import './i18n'
import i18nfr from './i18n/fr'
import { Unsubscribe } from './modules/Unsubscribe'

const App = () => (
  <IntlProvider locale="fr" messages={i18nfr}>
    <ApolloProvider client={client}>
      <GlobalStyle />
      <DefaultView>
        <Switch>
          <Route path="/unsubscribe/:uuid" component={Unsubscribe} />
          <Route path={['/week/:week', '/']} component={Home} />
        </Switch>
      </DefaultView>
    </ApolloProvider>
  </IntlProvider>
)

export default App
