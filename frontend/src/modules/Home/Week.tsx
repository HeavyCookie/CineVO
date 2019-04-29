import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { getMovies, getMoviesVariables } from './__generated__/getMovies'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { AnimatedPoster } from '../../components/movie/Poster'
import { FormattedMessage } from 'react-intl'

const MOVIES = gql`
  query getMovies($week: Int) {
    movies(week: $week) {
      id
      title
      poster
    }
  }
`

type Props = {
  week: number
}

export const Week = ({ week }: Props) => {
  const { data } = useQuery<getMovies, getMoviesVariables>(MOVIES, {
    variables: { week },
  })
  if (!data || !data.movies)
    return (
      <div>
        <FormattedMessage id="loading" />
      </div>
    )
  if (data.movies.length == 0)
    return (
      <div>
        <FormattedMessage id="modules.home.nomovies" />
      </div>
    )

  return (
    <>
      {data.movies.map(movie => (
        <Link key={movie.id} to={`/movies/${movie.id}`}>
          <AnimatedPoster name={movie.title} url={movie.poster} />
        </Link>
      ))}
    </>
  )
}
