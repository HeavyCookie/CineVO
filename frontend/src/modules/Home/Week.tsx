import React from 'react'
import gql from 'graphql-tag'
import { Link, Route } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'

import { AnimatedPoster, Wall, WallLoader } from '../../components/movie/Poster'
import { Movie } from '../Movie'

import { getMovies, getMoviesVariables } from './__generated__/getMovies'

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
  week?: number
}

export const Week = (props: Props) => {
  const week = props.week || 0
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
          <Link key={movie.id} to={`/week/${week}/movies/${movie.id}`}>
            <AnimatedPoster name={movie.title} url={movie.poster} />
          </Link>
        ))}
      </Wall>

      <Route
        path="/week/:week/movies/:movieId"
        render={props => (
          <Movie {...props} weekMovieIds={data.movies.map(m => m.id)} />
        )}
      />
    </>
  )
}
