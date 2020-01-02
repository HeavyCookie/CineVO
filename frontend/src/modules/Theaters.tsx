import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { List, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { getAllTheaters } from './__generated__/getAllTheaters'
import { Theater } from './Theater'

const GET_THEATERS_QUERY = gql`
  query getAllTheaters {
    listTheater {
      id
      name
      street
      postcode
      city
    }
  }
`

export const Theaters = () => {
  const { data } = useQuery<getAllTheaters>(GET_THEATERS_QUERY)

  if (!data || !data.listTheater) return null

  return (
    <Card.Group>
      {data.listTheater.map(theater => (
        <Link
          to={`/theaters/${theater.id}`}
          key={theater.id}
          className="card ui"
        >
          <Card.Content>
            <Card.Header>{theater.name}</Card.Header>
            <Card.Description>
              {theater.street}
              <br />
              {theater.postcode} {theater.city}
            </Card.Description>
          </Card.Content>
        </Link>
      ))}
    </Card.Group>
  )
}
