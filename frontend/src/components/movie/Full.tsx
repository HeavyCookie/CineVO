import * as React from 'react'
import styled from 'styled-components'
import { Poster } from './Poster'
import { Screenings } from './Screenings'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'

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

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
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
  next?: React.ReactChild | null
  previous?: React.ReactChild | null
  close?: () => void
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
  next,
  previous,
  close,
}: Props) => {
  return (
    <Modal onClose={close} open closeIcon centered={false}>
      <Backdrop src={backdrop || undefined} />
      <Informations>
        <PosterContainer>
          <Poster name={name} url={poster} />
        </PosterContainer>
        <div>
          {(previous || next) && (
            <Navigation>
              <div>{previous}</div>
              <div>{next}</div>
            </Navigation>
          )}
          <Title>{name}</Title>
          <Info>
            <FormattedMessage
              id="components.movie.full.actorList"
              values={{ actors: actors.join(', ') }}
            />
          </Info>
          <Info>
            <FormattedMessage
              id="components.movie.full.directorList"
              values={{ directors: directors.join(', ') }}
            />
          </Info>
          <Info>
            <FormattedMessage
              id="components.movie.full.duration"
              values={{ minutes: runtime / 60 }}
            />
          </Info>
          {!!synopsis && (
            <>
              <Title as="h2">
                <FormattedMessage id="components.movie.full.synopsis" />
              </Title>
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
    </Modal>
  )
}
