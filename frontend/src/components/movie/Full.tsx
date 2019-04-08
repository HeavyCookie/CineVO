import * as React from 'react'
import styled from 'styled-components'
import useClickAway from 'react-use/lib/useClickAway'
import { Poster } from './Poster'

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
`

const Content = styled.div`
  display: flex;
  margin: 10px 20%;

  background-color: white;
  border: 10px;
  border-radius: 3px;
  box-shadow: 0 0 10px 2px;
`

const Informations = styled.div`
  padding: 0 0.5em;
`

const Title = styled.h1`
  margin: 0.3em 0;
  padding-bottom: 3px;
  border-bottom: 1px solid lightgrey;
`

const Info = styled.div`
  font-size: 0.8em;
`

const Synopsis = styled.p`
  font-size: 0.9em;
  font-style: italic;
`

type Props = {
  movie: {
    poster: string
    name: string
    actors: string[]
    directors: string[]
    synopsis: string
    runtime: number
  }
  close?: (event: KeyboardEvent) => void
}

export const Full = ({
  movie: { name, poster, actors, directors, synopsis, runtime },
  close,
}: Props) => {
  const ref = React.useRef(null)

  if (close) useClickAway(ref, close)

  return (
    <Container>
      <Content ref={ref}>
        <Poster name={name} url={poster} />
        <Informations>
          <Title>{name}</Title>
          <Info>Avec {actors.join(', ')}</Info>
          <Info>De {directors.join(', ')}</Info>
          <Info>Durée : {runtime} minutes</Info>
          <Title as="h2">Synopsis</Title>
          <Synopsis>{synopsis}</Synopsis>
        </Informations>
      </Content>
    </Container>
  )
}
