import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

import { Unsubscribe as UnsubscribeComponent } from '../components/Subscriber/Unsubscribe'

import {
  unsubscribe as unsubscribeType,
  unsubscribeVariables,
  unsubscribe_unsubscribe, // eslint-disable-line @typescript-eslint/camelcase
} from './__generated__/unsubscribe'
import {
  resubscribeVariables,
  resubscribe as resubscribeType,
} from './__generated__/resubscribe'

type Props = RouteComponentProps<{ uuid: string; theaterId: string }>

const UNSUBSCRIBE_MUTATION = gql`
  mutation unsubscribe($uuid: ID!) {
    unsubscribe(id: $uuid) {
      id
      email
      createdAt
    }
  }
`

const RESUBSCRIBE_MUTATION = gql`
  mutation resubscribe(
    $email: String!
    $id: String!
    $createdAt: DateTime!
    $theaterId: ID!
  ) {
    subscribe(
      subscriber: { email: $email, id: $id, createdAt: $createdAt }
      theaterId: $theaterId
    )
  }
`

export const Unsubscribe = (props: Props) => {
  const [unsubscribed, setUnsubscribed] = useState(false)
  const [resubscribed, setResubscribed] = useState(false)
  const [notfound, setNotfound] = useState(false)
  const [unsubTimeout, setUnsubTimeout] = useState<
    undefined | NodeJS.Timeout | number
  >()
  const [oldSubscriber, setOldSubscriber] = useState<
    undefined | unsubscribe_unsubscribe // eslint-disable-line @typescript-eslint/camelcase
  >()

  const [unsubscribe] = useMutation<unsubscribeType, unsubscribeVariables>(
    UNSUBSCRIBE_MUTATION
  )
  const [resubscribe] = useMutation<resubscribeType, resubscribeVariables>(
    RESUBSCRIBE_MUTATION
  )

  useEffect(() => {
    const to = setTimeout(async () => {
      try {
        const result = await unsubscribe({
          variables: { uuid: props.match.params.uuid },
        })
        if (result.data) {
          setOldSubscriber(result.data.unsubscribe)
          setUnsubscribed(true)
        }
      } catch {
        setNotfound(true)
      }
    }, 5000)
    setUnsubTimeout(to)
  }, [props.match.params.uuid])

  return (
    <UnsubscribeComponent
      theaterId={props.match.params.theaterId}
      notfound={notfound}
      unsubscribed={unsubscribed}
      resubscribed={resubscribed}
      cancelUnsubscription={() => (
        unsubTimeout && clearTimeout(unsubTimeout as NodeJS.Timeout),
        setResubscribed(true)
      )}
      resubscribe={async () => {
        if (!oldSubscriber) return
        const { __typename, ...oldOne } = oldSubscriber
        resubscribe({
          variables: {
            ...oldOne,
            theaterId: props.match.params.theaterId,
          },
        })
        setResubscribed(true)
      }}
    />
  )
}
