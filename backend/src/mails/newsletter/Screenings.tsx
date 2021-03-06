import { format } from 'date-fns' // eslint-disable-line import/no-duplicates
import locale from 'date-fns/locale/fr' // eslint-disable-line import/no-duplicates
import { MjmlTable } from 'mjml-react'
import * as React from 'react'

import { Screening } from '@/entity/Screening'

export const Screenings = ({ list }: { list: Screening[] }) => {
  const data: { [key: string]: Date[] } = list.reduce(
    (acc: { [key: string]: Date[] }, { date }) => {
      const day = format(date, 'yyyy/MM/dd')

      return { ...acc, [day]: [...(acc[day] || []), date] }
    },
    {}
  )

  return (
    <MjmlTable font-size="11px">
      {Object.values(data).map(times => (
        <tr key={times[0].toString()}>
          <td>{format(times[0], 'E', { locale })}</td>
          <td>{times.map(date => format(date, "H'h'mm")).join(', ')}</td>
        </tr>
      ))}
    </MjmlTable>
  )
}
