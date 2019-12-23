import React from 'react'
import { format, parseISO } from 'date-fns'
import { FormattedDate, FormattedTime } from 'react-intl'
import * as Remeda from 'remeda'
import styled from '@emotion/styled'

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

export const Screenings = (props: Props) => {
  const data = Remeda.pipe(
    props.data,
    Remeda.map(x => (typeof x == 'string' ? parseISO(x) : x)),
    Remeda.groupBy(x => format(x, 'yyyy/MM/dd'))
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
              <>
                <FormattedTime key={time.toString()} value={time} />{' '}
              </>
            ))}
          </ScreeningList>
        </React.Fragment>
      ))}
    </Container>
  )
}
