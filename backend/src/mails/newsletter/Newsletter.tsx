import * as React from 'react'

import { User } from '../../entity/User'

import { Layout } from './Layout'
import { Theater } from './Theater'

export type Props = {
  subscriber: User
  dates: [Date, Date]
}

export const Newsletter = (props: Props) => (
  <Layout dates={props.dates} subscriber={props.subscriber}>
    {props.subscriber.subscriptions.map(({ theater }) => (
      <Theater key={theater.id} theater={theater} />
    ))}
  </Layout>
)
