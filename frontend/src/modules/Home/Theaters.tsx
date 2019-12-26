import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'

import { WallLoader } from '../../components/movie/Poster'

import { listTheaters } from './__generated__/listTheaters'

const THEATERS = gql`
  query listTheaters {
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
  const { data } = useQuery<listTheaters>(THEATERS)

  if (!data) return <WallLoader />

  return (
    <ul>
      {data.listTheater.map(theater => (
        <li key={theater.id}>
          <Link to={`/theaters/${theater.id}`}>{theater.name}</Link>
        </li>
      ))}
    </ul>
  )
}
