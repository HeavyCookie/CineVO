import React from 'react'
import { parse, format } from 'date-fns'
import { FormattedDate, FormattedTime } from 'react-intl'
import styled from 'styled-components'

const Container = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
`

const ScreeningList = styled.dd`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 5px;
`

type Props = {
  data: (string | Date | number)[]
}

export const Screenings = (props: Props) => {
  const data: { [key: string]: Date[] } = props.data.reduce(
    (acc: { [key: string]: Date[] }, data) => {
      const datetime = parse(data)
      const date = format(datetime, 'YYYY/MM/DD')

      return { ...acc, [date]: [...(acc[date] || []), datetime] }
    },
    {}
  )

  return (
    <Container>
      {Object.entries(data).map(([date, times]) => (
        <React.Fragment key={date}>
          <dt>
            <FormattedDate
              value={times[0]}
              weekday="long"
              day="numeric"
              month="long"
            />
          </dt>
          <ScreeningList>
            {times.map(time => (
              <FormattedTime key={time.toString()} value={time} />
            ))}
          </ScreeningList>
        </React.Fragment>
      ))}
    </Container>
  )
}
