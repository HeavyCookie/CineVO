import React from 'react'
import { Full } from '../components/movie/Full'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { getMovieDetails } from './__generated__/getMovieDetails'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

type Props = RouteComponentProps<{
  movieId: string
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
      next {
        id
      }
      previous {
        id
      }
    }
  }
`

export const Movie = (props: Props) => {
  const { data } = useQuery<getMovieDetails>(GET_MOVIE_DETAILS, {
    variables: { id: props.match.params.movieId },
  })

  if (!data || !data.movie) return null

  const screenings = data.movie.screenings.map(screening => screening.date)

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
        data.movie.previous && data.movie.previous.id ? (
          <Link to={`/movies/${data.movie.previous.id}`}>
            <FormattedMessage id="components.movie.full.previous" />
          </Link>
        ) : (
          undefined
        )
      }
      next={
        data.movie.next && data.movie.next.id ? (
          <Link to={`/movies/${data.movie.next.id}`}>
            <FormattedMessage id="components.movie.full.next" />
          </Link>
        ) : (
          undefined
        )
      }
      close={() => props.history.push('/')}
    />
  )
}
