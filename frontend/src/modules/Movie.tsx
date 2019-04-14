import React from 'react'
import { Full } from '../components/movie/Full'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { getMovieDetails } from './__generated__/getMovieDetails'
import { RouteComponentProps } from 'react-router'

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
    }
  }
`

export const Movie = (props: Props) => {
  const { data } = useQuery<getMovieDetails>(GET_MOVIE_DETAILS, {
    variables: { id: props.match.params.movieId },
  })

  if (!data || !data.movie) return null
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
      }}
      close={() => props.history.push('/')}
    />
  )
}
