import * as React from 'react'
import { Email } from './Email'
import { Week } from './Week'
import { RouteComponentProps } from 'react-router'
import { Menu, Label, Loader, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getWeek } from '../../lib/theater-weeks'
import { FormattedDate } from 'react-intl'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import { countMovies, countMoviesVariables } from './__generated__/countMovies'

const SCREENING_COUNT = gql`
  query countMovies($week: Int) {
    countMoviesForWeek(week: $week)
  }
`

const MenuItem = ({ week, i }: { week: number; i: number }) => {
  const [start, end] = getWeek(i)
  const { data } = useQuery<countMovies, countMoviesVariables>(
    SCREENING_COUNT,
    { variables: { week: i } }
  )

  return (
    <Menu.Item active={i == week}>
      <Link to={`/week/${i}`}>
        <FormattedDate value={start} day="numeric" month="long" /> -{' '}
        <FormattedDate value={end} day="numeric" month="long" />
      </Link>
      <Label icon="spinner loading">{data && data.countMoviesForWeek}</Label>
    </Menu.Item>
  )
}

const StyledMenu = styled(Menu)`
  justify-content: center;
`

type Props = RouteComponentProps<{ week?: string }>

const Home = (props: Props) => {
  const stringWeek = props.match.params.week
  const week = (stringWeek && parseInt(stringWeek)) || 0
  const displayedWeeks = [0, 1, 2, 3]

  return (
    <>
      <Email />
      <StyledMenu pointing secondary>
        {displayedWeeks.map(i => (
          <MenuItem key={i} i={i} week={week} />
        ))}
      </StyledMenu>
      <Week week={week} />
    </>
  )
}

export default Home
