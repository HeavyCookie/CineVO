import { render } from 'mjml-react'
import { Newsletter } from '../mails/Newsletter'
import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { Subscriber } from '../entity/Subscriber'

export const htmlNewsletter = async (
  subscriber: Subscriber,
  dates: [Date, Date],
  movies: Movie[],
  screenings: { [key: string]: Screening[] }
) => {
  const { html } = render(
    Newsletter({
      dates,
      movies,
      screenings,
      subscriber,
    })
  )

  return html
}
