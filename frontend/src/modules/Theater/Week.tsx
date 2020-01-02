import React from 'react'
import gql from 'graphql-tag'
import { Link, Route } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'

import { AnimatedPoster, Wall, WallLoader } from '../../components/movie/Poster'
import { TheaterMovie } from '../TheaterMovie'

import { getMovies, getMoviesVariables } from './__generated__/getMovies'

const MOVIES = gql`
  query getMovies($week: Int, $theaterId: ID) {
    movies(week: $week, theaterId: $theaterId) {
      id
      title
      poster
    }
  }
`

type Props = {
  theaterId: string
  week?: number
}

export const Week = (props: Props) => {
  const { week, theaterId } = props
  const { data } = useQuery<getMovies, getMoviesVariables>(MOVIES, {
    variables: { week, theaterId },
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
          <Link
            key={movie.id}
            to={`/theaters/${props.theaterId}/week/${week}/movies/${movie.id}`}
          >
            <AnimatedPoster name={movie.title} url={movie.poster} />
          </Link>
        ))}
      </Wall>

      <Route
        path="/theaters/:theaterId/week/:week/movies/:movieId"
        render={props => (
          <TheaterMovie {...props} weekMovieIds={data.movies.map(m => m.id)} />
        )}
      />
    </>
  )
}
