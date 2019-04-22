import { render } from 'mjml-react'
import { Newsletter } from '../mails/Newsletter'
import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'

export const htmlNewsletter = async (
  dates: [Date, Date],
  movies: Movie[],
  screenings: { [key: string]: Screening[] }
) => {
  const { html } = render(
    Newsletter({
      dates,
      movies,
      screenings,
    })
  )

  return html
}
