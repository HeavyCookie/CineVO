import { render } from 'mjml-react'

import { Newsletter } from '../mails/newsletter/Newsletter'
import { User } from '../entity/User'

export const htmlNewsletter = async (subscriber: User, dates: [Date, Date]) => {
  const { html } = render(
    Newsletter({
      dates,
      subscriber,
    })
  )

  return html
}
