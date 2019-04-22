import * as React from 'react'
import { Mjml, MjmlBody, MjmlHero, MjmlText, MjmlSection } from 'mjml-react'
import { format } from 'date-fns'
import * as locale from 'date-fns/locale/fr'

export const Layout = ({
  children,
  dates,
}: {
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
        <MjmlSection background-color="#fff">{children}</MjmlSection>
      </MjmlBody>
    </Mjml>
  )
}
