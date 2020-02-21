import { format } from 'date-fns' // eslint-disable-line import/no-duplicates
import locale from 'date-fns/locale/fr' // eslint-disable-line import/no-duplicates
import {
  Mjml,
  MjmlBody,
  MjmlHero,
  MjmlText,
  MjmlSection,
  MjmlColumn,
} from 'mjml-react'
import * as React from 'react'

import { User } from '@/entity/User'

export const Layout = ({
  children,
  dates,
  subscriber,
}: {
  subscriber: User
  dates: [Date, Date]
  children: React.ReactNode
}) => {
  const months = dates.map(date => date.getMonth())
  const sameMonth = months[0] == months[1]

  const from = sameMonth
    ? format(dates[0], 'Do', { locale })
    : format(dates[0], 'Do MMMM', { locale })
  const to = format(dates[1], 'Do MMMM', { locale })

  return (
    <Mjml>
      <MjmlBody>
        <MjmlHero>
          <MjmlText fontSize="20px" align="center">
            CineVO
          </MjmlText>
        </MjmlHero>
        <MjmlHero background-color="#db2828">
          <MjmlText align="center" color="#fff">
            Semaine du {from} au {to}
          </MjmlText>
        </MjmlHero>
        {children}
        <MjmlSection>
          <MjmlColumn backgroundColor="#db2828">
            <MjmlText align="center">
              <a
                href={`${process.env.BASE_URL || ''}/unsusbscribe/${
                  subscriber.id
                }`}
                style={{ color: '#FFF' }}
              >
                Se désinscrire
              </a>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}
