import * as React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { Context } from '../context'

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

export const DefaultView = (props: {
  children: React.ReactNode
  homeLink: (props: { children: React.ReactNode }) => React.ReactElement
}) => {
  const HomeLink = props.homeLink

  const { token } = React.useContext(Context)

  return (
    <Container>
      <Header>
        <Title>
          <HomeLink>CineVO</HomeLink>
        </Title>
        <Subtitle>
          <FormattedMessage id="components.layout.subtitle" />
        </Subtitle>
      </Header>
      <Content>
        <SessionBox>
          {token ? (
            <div>
              <Link to="/me">
                <FormattedMessage id="components.layout.editAccount" />
              </Link>{' '}
              •{' '}
              <Link to="/logout">
                <FormattedMessage id="components.layout.logout" />
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <FormattedMessage id="components.layout.login" />
              </Link>
            </div>
          )}
        </SessionBox>
        {props.children}
      </Content>
    </Container>
  )
}
