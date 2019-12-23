import React from 'react'
import gql from 'graphql-tag'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'

import { Full } from '../components/movie/Full'

import { getMovieDetails } from './__generated__/getMovieDetails'

type Props = {
  weekMovieIds: string[]
} & RouteComponentProps<{
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
      screenings {
        date
      }
    }
  }
`

export const Movie = withRouter((props: Props) => {
  const { week } = props.match.params
  const { data } = useQuery<getMovieDetails>(GET_MOVIE_DETAILS, {
    variables: { id: props.match.params.movieId },
  })

  if (!data || !data.movie) return null

  const screenings = data.movie.screenings.map(screening => screening.date)

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
        screenings,
      }}
      previous={
        previousMovieId && (
          <Link to={`/week/${week}/movies/${previousMovieId}`}>
            <FormattedMessage id="components.movie.full.previous" />
          </Link>
        )
      }
      next={
        nextMovieId && (
          <Link to={`/week/${week}/movies/${nextMovieId}`}>
            <FormattedMessage id="components.movie.full.next" />
          </Link>
        )
      }
      close={() => props.history.push(`/week/${week}`)}
    />
  )
})
