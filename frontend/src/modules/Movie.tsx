import React from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Helmet from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from '@emotion/styled'

import * as MovieFull from '../components/movie/Full'
import { Poster } from '../components/movie/Poster'

import { getMovie, getMovieVariables } from './__generated__/getMovie'

type Props = RouteComponentProps<{ movieId: string }>

const MOVIE_DETAILS_QUERY = gql`
  query getMovie($movieId: ID!) {
    movie(id: $movieId) {
      id
      title
      poster
      actors
      directors
      runtime
      plot
      backdrop
    }
  }
`

const Container = styled.div`
  margin-right: -1em;
  margin-left: -1em;
`

export const Movie = (props: Props) => {
  const { movieId } = props.match.params
  const { data } = useQuery<getMovie, getMovieVariables>(MOVIE_DETAILS_QUERY, {
    variables: { movieId },
  })

  if (!data) return null

  if (!data.movie) return <Redirect to="/" />

  const { movie } = data

  return (
    <>
      <Helmet>
        <title>{data.movie.title}</title>
      </Helmet>
      <Container>
        <MovieFull.Backdrop src={movie.backdrop || undefined} />
        <MovieFull.Informations>
          <MovieFull.PosterContainer>
            <Poster name={movie.title} url={movie.poster} />
          </MovieFull.PosterContainer>
          <div>
            <MovieFull.Title>{movie.title}</MovieFull.Title>
            <MovieFull.Info>
              <FormattedMessage
                id="components.movie.full.actorList"
                values={{ actors: movie.actors.join(', ') }}
              />
            </MovieFull.Info>
            <MovieFull.Info>
              <FormattedMessage
                id="components.movie.full.directorList"
                values={{ directors: movie.directors.join(', ') }}
              />
            </MovieFull.Info>
            <MovieFull.Info>
              <FormattedMessage
                id="components.movie.full.duration"
                values={{ minutes: movie.runtime / 60 }}
              />
            </MovieFull.Info>

            {!!movie.plot && (
              <>
                <MovieFull.Subtitle>
                  <FormattedMessage id="components.movie.full.synopsis" />
                </MovieFull.Subtitle>
                <MovieFull.Synopsis>{movie.plot}</MovieFull.Synopsis>
              </>
            )}
          </div>
        </MovieFull.Informations>
      </Container>
    </>
  )
}
