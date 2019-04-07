import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #db2828;
`

const Title = styled.h1`
  color: white;
  text-shadow: 0 1px 0 #eee, 0 2px 0 #e5e5e5, -1px 3px 0 #c8c8c8,
    -2px 7px 2px rgba(0, 0, 0, 0.6), -2px 7px 8px rgba(0, 0, 0, 0.2),
    -2px 7px 45px rgba(0, 0, 0, 0.4);
`

const Subtitle = styled.h2`
  color: rgb(240, 240, 240);
  font-weight: normal;
  font-size: 1em;
`

export const Home = (props: { children: React.ReactNode }) => {
  return (
    <Container>
      <Title>CineVO</Title>
      <Subtitle>Vos prochaines séances de cinéma en version originale</Subtitle>
      {props.children}
    </Container>
  )
}
