import React, { useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled'
import { Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { Poster } from '../../components/movie/Poster'
import { Context } from '../../context'

import { popularMovies } from './__generated__/popularMovies'

const POPULAR_MOVIES_QUERY = gql`
  query popularMovies {
    popularMoviesThisWeek {
      id
      title
      poster
    }
  }
`

const MovieWall = styled.div`
  text-align: center;
`

export const Movies = () => {
  const { data } = useQuery<popularMovies>(POPULAR_MOVIES_QUERY)

  const { token } = useContext(Context)
  return (
    <>
      <Header as="h1">
        Film les plus diffusés cette semaine
        {token ? ' dans vos abonnements' : ''}
      </Header>
      <MovieWall>
        {data?.popularMoviesThisWeek.map(movie => (
          <Link to={`/movies/${movie.id}`} key={movie.id}>
            <Poster
              url={movie.poster}
              name={movie.title}
              maxHeight={266}
              maxWidth={200}
            />
          </Link>
        ))}
      </MovieWall>
    </>
  )
}
