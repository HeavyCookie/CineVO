import styled from '@emotion/styled'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'

import Context from './Context'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled(Container)`
  width: 100%;
  padding-bottom: 3em;
  background-color: #db2828;
`

const Title = styled.h1`
  color: white;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8), 0 2px 3px rgb(0, 0, 0);
  * {
    color: white;
  }
`

const Subtitle = styled.h2`
  color: rgb(240, 240, 240);
  font-weight: normal;
  font-size: 1em;
`

const Content = styled.div`
  width: 80%;
  min-height: 4em;
  margin-top: -2em;
  padding: 1em;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`

const SessionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Layout = (props: {
  children: React.ReactNode
  /** State of the current user connected to app. Show different header links on top of the app */
  isLoggedIn?: boolean
}) => {
  const { Link } = useContext(Context)

  return (
    <Container>
      <Header>
        <Title>
          <Link to="/">CineVO</Link>
        </Title>
        <Subtitle>
          <Trans i18nKey="components.layout.subtitle">
            Vos prochaines séances de cinéma en version originale
          </Trans>
        </Subtitle>
      </Header>
      <Content>
        <SessionBox>
          {props.isLoggedIn ? (
            <div>
              <Link to="/me">
                <Trans i18nKey="components.layout.editAccount">
                  Modifier mon compte
                </Trans>
              </Link>{' '}
              •{' '}
              <Link to="/logout">
                <Trans i18nKey="components.layout.logout">Se déconnecter</Trans>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <Trans i18nKey="components.layout.login">Se connecter</Trans>
              </Link>{' '}
              •{' '}
              <Link to="/signup">
                <Trans i18nKey="components.layout.signup">
                  Créer un compte
                </Trans>
              </Link>
            </div>
          )}
        </SessionBox>
        {props.children}
      </Content>
    </Container>
  )
}

export default Layout
