import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled'
import { Header } from 'semantic-ui-react'

import { Poster } from '../../components/movie/Poster'

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

  return (
    <>
      <Header as="h1">Film les plus diffusés cette semaine</Header>
      <MovieWall>
        {data?.popularMoviesThisWeek.map(movie => (
          <Poster
            key={movie.id}
            url={movie.poster}
            name={movie.title}
            maxHeight={266}
            maxWidth={200}
          />
        ))}
      </MovieWall>
    </>
  )
}
