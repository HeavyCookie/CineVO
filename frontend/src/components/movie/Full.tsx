import * as React from 'react'
import styled from 'styled-components'
import useClickAway from 'react-use/lib/useClickAway'
import { Poster } from './Poster'
import { animated, useSpring } from 'react-spring'

const Container = styled(animated.div)`
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
    poster: string | null
    name: string
    actors: string[]
    directors: string[]
    synopsis: string | null
    runtime: number
  }
  close?: (event: KeyboardEvent) => void
}

export const Full = ({
  movie: { name, poster, actors, directors, synopsis, runtime },
  close,
}: Props) => {
  const ref = React.useRef(null)

  const [effect, setEffect] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }))

  if (close)
    useClickAway(ref, () => {
      setEffect({ to: { opacity: 0 } })
      setTimeout(close, 200)
    })

  return (
    <Container style={effect}>
      <Content ref={ref}>
        <Poster name={name} url={poster} />
        <Informations>
          <Title>{name}</Title>
          <Info>Avec {actors.join(', ')}</Info>
          <Info>De {directors.join(', ')}</Info>
          <Info>Durée : {runtime} minutes</Info>
          {!!synopsis && (
            <>
              <Title as="h2">Synopsis</Title>
              <Synopsis>{synopsis}</Synopsis>
            </>
          )}
        </Informations>
      </Content>
    </Container>
  )
}
