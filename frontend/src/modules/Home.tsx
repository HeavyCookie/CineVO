import * as React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { getMovies, getMoviesVariables } from './__generated__/getMovies'
import { Poster } from '../components/movie/Poster'
import { Link } from 'react-router-dom'

const MOVIES = gql`
  query getMovies($week: Int) {
    movies(week: $week) {
      id
      title
      poster
    }
  }
`

const Home = () => {
  const { data } = useQuery<getMovies, getMoviesVariables>(MOVIES, {
    variables: { week: 0 },
  })
  if (!data || !data.movies) return <div>Chargement</div>

  return (
    <>
      {data.movies.map(movie => (
        <Link key={movie.id} to={`/movies/${movie.id}`}>
          <Poster name={movie.title} url={movie.poster} />
        </Link>
      ))}
    </>
  )
}

export default Home
