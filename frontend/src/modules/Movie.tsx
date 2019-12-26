import React from 'react'
import gql from 'graphql-tag'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'

import { Full } from '../components/movie/Full'

import {
  getMovieDetails,
  getMovieDetailsVariables,
} from './__generated__/getMovieDetails'
import {
  getScreenings,
  getScreeningsVariables,
} from './__generated__/getScreenings'

type Props = {
  weekMovieIds: string[]
} & RouteComponentProps<{
  theaterId: string
  movieId: string
  week: string
}>

const GET_MOVIE_DETAILS = gql`
  query getMovieDetails($id: ID!) {
    movie(id: $id) {
      id
      poster
      actors
      directors
      runtime
      poster
      plot
      title
      backdrop
    }
  }
`

const GET_SCREENINGS = gql`
  query getScreenings($movieId: ID!, $theaterId: ID!) {
    getScreenings(theaterId: $theaterId, movieId: $movieId) {
      date
    }
  }
`

export const Movie = withRouter((props: Props) => {
  const { week, theaterId, movieId } = props.match.params
  const { data } = useQuery<getMovieDetails, getMovieDetailsVariables>(
    GET_MOVIE_DETAILS,
    {
      variables: { id: movieId },
    }
  )

  const { data: screenings } = useQuery<getScreenings, getScreeningsVariables>(
    GET_SCREENINGS,
    {
      variables: { movieId, theaterId },
    }
  )

  if (!data || !data.movie || !screenings || !screenings.getScreenings)
    return null

  // const screenings = data.movie.screenings.map(screening => screening.date)

  const currentMoviePos = props.weekMovieIds.indexOf(props.match.params.movieId)
  const previousMovieId = props.weekMovieIds[currentMoviePos - 1]
  const nextMovieId = props.weekMovieIds[currentMoviePos + 1]

  return (
    <Full
      movie={{
        name: data.movie.title,
        actors: data.movie.actors,
        directors: data.movie.directors,
        poster: data.movie.poster,
        runtime: data.movie.runtime,
        synopsis: data.movie.plot,
        backdrop: data.movie.backdrop,
        screenings: screenings.getScreenings.map(s => s.date),
      }}
      previous={
        previousMovieId && (
          <Link
            to={`/theaters/${theaterId}/week/${week}/movies/${previousMovieId}`}
          >
            <FormattedMessage id="components.movie.full.previous" />
          </Link>
        )
      }
      next={
        nextMovieId && (
          <Link
            to={`/theaters/${theaterId}/week/${week}/movies/${nextMovieId}`}
          >
            <FormattedMessage id="components.movie.full.next" />
          </Link>
        )
      }
      close={() => props.history.push(`/theaters/${theaterId}/week/${week}`)}
    />
  )
})
