import styled from '@emotion/styled'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'
import * as R from 'remeda'

const Container = styled.dl`
  display: grid;
  grid-template-columns: auto auto;
  max-width: 200px;
`

const ScreeningList = styled.dd`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 5px;
`

type Props = {
  data: (string | Date | number)[]
}

const Screenings = (props: Props) => {
  const data = R.pipe(
    props.data,
    R.map(x => (typeof x == 'string' ? parseISO(x) : x)),
    R.groupBy(x => format(x, 'yyyy/MM/dd'))
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
              <React.Fragment key={time.toString()}>
                <FormattedTime value={time} />{' '}
              </React.Fragment>
            ))}
          </ScreeningList>
        </React.Fragment>
      ))}
    </Container>
  )
}

export default Screenings
