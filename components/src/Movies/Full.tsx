import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import * as React from 'react'
import { Trans } from 'react-i18next'

import Poster from './Poster'
import Screenings from './Screenings'

export const Backdrop = styled.img`
  display: block;
  width: 100%;
  height: 10em;
  object-fit: cover;
`

export const Informations = styled.div`
  display: grid;
  grid-gap: 0.5em;
  grid-template-columns: auto 1fr;
  margin: 0.5em;
`

export const CustomizedPoster = styled(Poster)`
  margin-top: -5em;
  border: 3px solid white;
  width: 200px;
  @media screen and (max-width: 500px) {
    display: none;
  }
`

export const Title = styled.h1`
  margin: 0.3em 0;
  padding-bottom: 3px;
  border-bottom: 1px solid lightgrey;
`

export const Subtitle = Title.withComponent('h2')

export const Info = styled.div`
  font-size: 0.8em;
`

export const Synopsis = styled.p`
  font-size: 0.9em;
  font-style: italic;
`

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
`

type Props = {
  movie: {
    poster?: string
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

const Full = ({
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
  const [open, setOpen] = React.useState(true)
  return (
    <Modal onClose={close || (() => setOpen(false))} isOpen={open} size="90%">
      <ModalOverlay />
      <ModalCloseButton color="white" />
      <ModalContent>
        <Backdrop src={backdrop || undefined} />
        <Informations>
          <CustomizedPoster name={name} url={poster} />

          <div>
            {(previous || next) && (
              <Navigation>
                <div>{previous}</div>
                <div>{next}</div>
              </Navigation>
            )}
            <Title>{name}</Title>
            <Info>
              <Trans i18nKey="components.movie.full.actorList">
                Avec {{ actors: actors.join(', ') }}
              </Trans>
            </Info>
            <Info>
              <Trans i18nKey="components.movie.full.directorList">
                De {{ directors: directors.join(', ') }}
              </Trans>
            </Info>
            <Info>
              <Trans i18nKey="components.movie.full.duration">
                Durée : {{ minutes: runtime / 60 }} minutes
              </Trans>
            </Info>
            {!!synopsis && (
              <>
                <Subtitle>
                  <Trans i18nKey="components.movie.full.synopsis">
                    Synopsis
                  </Trans>
                </Subtitle>
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
      </ModalContent>
    </Modal>
  )
}

export default Full
