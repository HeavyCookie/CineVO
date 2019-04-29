import * as React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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

export const DefaultView = (props: { children: React.ReactNode }) => {
  return (
    <Container>
      <Header>
        <Title>CineVO</Title>
        <Subtitle>
          <FormattedMessage id="components.layout.subtitle" />
        </Subtitle>
      </Header>
      <Content>{props.children}</Content>
    </Container>
  )
}
