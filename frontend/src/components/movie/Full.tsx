import * as React from 'react'
import styled from 'styled-components'
import useClickAway from 'react-use/lib/useClickAway'
import { Poster } from './Poster'
import { animated, useSpring } from 'react-spring'
import { Screenings } from './Screenings'

const Container = styled(animated.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
`

const Popin = styled.div`
  width: 80%;
  margin: auto;
  overflow: scroll;

  background-color: white;
  border: 10px;
  border-radius: 3px;
  box-shadow: 0 0 10px 2px;
`

const Backdrop = styled.img`
  display: block;
  width: 100%;
  height: 10em;
  object-fit: cover;
`

const Informations = styled.div`
  display: grid;
  grid-gap: 0.5em;
  grid-template-columns: auto 1fr;
  margin: 0.5em;
`

const PosterContainer = styled.div`
  margin-top: -5em;
  border: 3px solid white;
  @media screen and (max-width: 500px) {
    display: none;
  }
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
    /* Movie length in seconds */
    runtime: number
    backdrop: string | null
    screenings?: (string | Date | number)[]
  }
  close?: (event?: KeyboardEvent) => void
}

export const Full = ({
  movie: {
    name,
    poster,
    actors,
    directors,
    synopsis,
    runtime,
    backdrop,
    screenings,
  },
  close,
}: Props) => {
  const ref = React.useRef(null)

  const [effect, setEffect] = useSpring(() => ({
    from: { opacity: 0 },
    to: async (next: Function) => {
      await next({ opacity: 1 })
    },
  }))

  if (close)
    useClickAway(ref, () => {
      setEffect({
        to: async next => {
          await next({ opacity: 0 })
          close()
        },
      })
    })

  return (
    <Container style={effect}>
      <Popin ref={ref}>
        <Backdrop src={backdrop || undefined} />
        <Informations>
          <PosterContainer>
            <Poster name={name} url={poster} />
          </PosterContainer>
          <div>
            <Title>{name}</Title>
            <Info>Avec {actors.join(', ')}</Info>
            <Info>De {directors.join(', ')}</Info>
            <Info>Durée : {runtime / 60} minutes</Info>
            {!!synopsis && (
              <>
                <Title as="h2">Synopsis</Title>
                <Synopsis>{synopsis}</Synopsis>
              </>
            )}
            {screenings && (
              <Info>
                <Screenings data={screenings} />
              </Info>
            )}
          </div>
        </Informations>
      </Popin>
    </Container>
  )
}
