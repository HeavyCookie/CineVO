import * as React from 'react'
import { MjmlTable } from 'mjml-react'
import { format } from 'date-fns'
import * as frLocale from 'date-fns/locale/fr'
import { Screening } from '../entity/Screening'

export const Screenings = ({ list }: { list: Screening[] }) => {
  const data: { [key: string]: Date[] } = list.reduce(
    (acc: { [key: string]: Date[] }, { date }) => {
      const day = format(date, 'YYYY/MM/DD')

      return { ...acc, [day]: [...(acc[day] || []), date] }
    },
    {}
  )
  return (
    <MjmlTable font-size="11px">
      {Object.values(data).map(times => (
        <tr>
          <td>{format(times[0], 'ddd', { locale: frLocale })}</td>
          <td>{times.map(date => format(date, 'H[h]mm')).join(', ')}</td>
        </tr>
      ))}
    </MjmlTable>
  )
}
