import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Icon } from 'semantic-ui-react'

import { WallLoader } from '../../components/movie/Poster'

import {
  listTheaters,
  listTheatersVariables,
} from './__generated__/listTheaters'

const THEATERS = gql`
  query listTheaters($limit: Int) {
    listTheater(limit: $limit) {
      id
      name
      street
      postcode
      city
    }
  }
`

const Container = styled.div`
  text-align: center;
`

const List = styled.ul`
  list-style: none;
  li {
    display: inline-block;

    & + li::before {
      padding-right: 0.3em;
      padding-left: 0.3em;
      content: '•';
    }
  }
`

export const Theaters = () => {
  const { data } = useQuery<listTheaters, listTheatersVariables>(THEATERS, {
    variables: { limit: 10 },
  })

  if (!data) return <WallLoader />

  return (
    <Container>
      <List>
        {data.listTheater.map(theater => (
          <li key={theater.id}>
            <Link to={`/theaters/${theater.id}`}>{theater.name}</Link> (
            {theater.postcode} {theater.city})
          </li>
        ))}
        <li></li>
      </List>
      <Link to="/theaters">
        <Icon name="arrow alternate circle right" />
        Voir tous les cinémas
      </Link>
    </Container>
  )
}
