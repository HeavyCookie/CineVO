import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { getMovies, getMoviesVariables } from './__generated__/getMovies'
import gql from 'graphql-tag'
import { Link, Route } from 'react-router-dom'
import { AnimatedPoster, Wall, WallLoader } from '../../components/movie/Poster'
import { FormattedMessage } from 'react-intl'
import { Movie } from '../Movie'

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

  if (!data || !data.movies) return <WallLoader />

  if (data.movies.length == 0)
    return (
      <div>
        <FormattedMessage id="modules.home.nomovies" />
      </div>
    )

  return (
    <>
      <Wall>
        {data.movies.map(movie => (
          <Link key={movie.id} to={`/movies/${movie.id}`}>
            <AnimatedPoster name={movie.title} url={movie.poster} />
          </Link>
        ))}
      </Wall>

      <Route
        path="/movies/:movieId"
        render={props => (
          <Movie {...props} weekMovieIds={data.movies.map(m => m.id)} />
        )}
      />
    </>
  )
}
