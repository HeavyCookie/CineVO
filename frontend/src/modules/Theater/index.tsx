import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Menu, Label, Header, Divider } from 'semantic-ui-react'
import { FormattedDate } from 'react-intl'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled'
import Helmet from 'react-helmet'

import { getWeek } from '../../lib/theater-weeks'

import { Week } from './Week'
import { countMovies, countMoviesVariables } from './__generated__/countMovies'
import { Subscribe } from './Subscribe'
import {
  theaterDetails,
  theaterDetailsVariables,
} from './__generated__/theaterDetails'

const SCREENING_COUNT = gql`
  query countMovies($theaterId: ID, $week: Int) {
    countMoviesForWeek(week: $week, theaterId: $theaterId)
  }
`

const THEATER_DETAILS_QUERY = gql`
  query theaterDetails($id: ID!) {
    getTheater(id: $id) {
      id
      name
      street
      postcode
      city
    }
  }
`

const MenuItem = ({
  week,
  i,
  theaterId,
}: {
  week: number
  i: number
  theaterId: string
}) => {
  const [start, end] = getWeek(i)
  const { data } = useQuery<countMovies, countMoviesVariables>(
    SCREENING_COUNT,
    { variables: { week: i, theaterId } }
  )

  return (
    <Menu.Item active={i == week}>
      <Link to={`/theaters/${theaterId}/week/${i}`}>
        <FormattedDate value={start} day="numeric" month="long" /> -{' '}
        <FormattedDate value={end} day="numeric" month="long" />
      </Link>
      <Label icon={!data && 'spinner'}>{data && data.countMoviesForWeek}</Label>
    </Menu.Item>
  )
}

const StyledMenu = styled(Menu)`
  justify-content: center;
`
type Props = RouteComponentProps<{ week?: string; theaterId: string }>

export const Theater = (props: Props) => {
  const stringWeek = props.match.params.week
  const theaterId = props.match.params.theaterId
  const week = (stringWeek && parseInt(stringWeek)) || 0
  const displayedWeeks = [0, 1, 2, 3]

  const { data } = useQuery<theaterDetails, theaterDetailsVariables>(
    THEATER_DETAILS_QUERY,
    {
      variables: { id: props.match.params.theaterId },
    }
  )

  return (
    <>
      <Helmet>
        <title>{data?.getTheater.name}</title>
      </Helmet>
      <Header size="huge">{data?.getTheater.name}</Header>
      <p>
        {data?.getTheater.street}
        <br />
        {data?.getTheater.postcode} {data?.getTheater.city}
      </p>{' '}
      <Subscribe theaterId={theaterId} />
      <Divider />
      <StyledMenu pointing secondary>
        {displayedWeeks.map(i => (
          <MenuItem key={i} i={i} week={week} theaterId={theaterId} />
        ))}
      </StyledMenu>
      <Week week={week} theaterId={theaterId} />
    </>
  )
}
