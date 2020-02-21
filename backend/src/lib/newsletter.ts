import { render } from 'mjml-react'

import { User } from 'entity/User'

import { Newsletter } from '../mails/newsletter/Newsletter'

export const htmlNewsletter = async (subscriber: User, dates: [Date, Date]) => {
  const { html } = render(
    Newsletter({
      dates,
      subscriber,
    })
  )

  return html
}
