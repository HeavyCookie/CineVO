import * as React from 'react'
import { Route, Switch, Link } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'

import Home from './modules/Home'
import { client } from './apollo'
import { DefaultView } from './components/DefaultView'
import { GlobalStyle } from './components/GlobalStyle'
import './i18n'
import i18nfr from './i18n/fr'
import { Unsubscribe } from './modules/Unsubscribe'
import { Theaters } from './modules/Theaters'
import { Login } from './modules/Login'
import { Logout } from './modules/Logout'
import { TokenProvider } from './context'
import { Account } from './modules/Account'
import { Signup } from './modules/Signup'
import { ResetPasswordRequest } from './modules/ResetPasswordRequest'
import { ResetPassword } from './modules/ResetPassword'

const App = () => (
  <TokenProvider>
    <IntlProvider locale="fr" messages={i18nfr}>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <DefaultView
          homeLink={({ children }: { children: React.ReactNode }) => (
            <Link to="/">{children}</Link>
          )}
        >
          <Switch>
            <Route path="/unsubscribe/:uuid" component={Unsubscribe} />
            <Route
              path={['/theaters/:theaterId/week/:week', '/theaters/:theaterId']}
              component={Theaters}
            />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/me" component={Account} />
            <Route path="/signup" component={Signup} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/reset-password" component={ResetPasswordRequest} />
            <Route path="/" component={Home} />
          </Switch>
        </DefaultView>
      </ApolloProvider>
    </IntlProvider>
  </TokenProvider>
)

export default App
