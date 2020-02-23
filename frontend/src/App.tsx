import * as React from 'react'

import { ApolloProvider } from 'react-apollo'

import Helmet from 'react-helmet'

import { IntlProvider } from 'react-intl'

import { Route, Switch, Link } from 'react-router-dom'

import { client } from './apollo'

import { DefaultView } from './components/DefaultView'

import { GlobalStyle } from './components/GlobalStyle'

import './i18n'

import { TokenProvider } from './context'

import i18nfr from './i18n/fr'

import { Account } from './modules/Account'

import Home from './modules/Home'

import { Login } from './modules/Login'

import { Logout } from './modules/Logout'

import { Movie } from './modules/Movie'

import { ResetPassword } from './modules/ResetPassword'

import { ResetPasswordRequest } from './modules/ResetPasswordRequest'

import { Signup } from './modules/Signup'

import { Theater } from './modules/Theater'

import { Theaters } from './modules/Theaters'

import { Unsubscribe } from './modules/Unsubscribe'

const App = () => (
  <TokenProvider>
    <IntlProvider locale="fr" messages={i18nfr}>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <Helmet titleTemplate="%s • CineVO" defaultTitle="CineVO">
          <meta charSet="utf-8" />
        </Helmet>
        <DefaultView
          homeLink={({ children }: { children: React.ReactNode }) => (
            <Link to="/">{children}</Link>
          )}
        >
          <Switch>
            <Route path="/unsubscribe/:uuid" component={Unsubscribe} />
            <Route
              path={['/theaters/:theaterId/week/:week', '/theaters/:theaterId']}
              component={Theater}
            />
            <Route path="/theaters/" component={Theaters} />
            <Route path="/movies/:movieId" component={Movie} />
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
