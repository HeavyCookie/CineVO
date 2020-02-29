import gql from 'graphql-tag'
import React, { useState, useContext } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, Popup } from 'semantic-ui-react'

import { Subscribe as SubscribeForm } from '../../components/Subscriber/Subscribe'
import { Context } from '../../context'

import {
  addSubscription,
  addSubscriptionVariables,
} from './__generated__/addSubscription'
import {
  isSubscribedVariables,
  isSubscribed,
} from './__generated__/isSubscribed'
import {
  removeSubscriptionFromTheater,
  removeSubscriptionFromTheaterVariables,
} from './__generated__/removeSubscriptionFromTheater'

const MUTATION = gql`
  mutation subscribeToNewsletter($email: String!, $theaterId: ID!) {
    subscribe(subscriber: { email: $email }, theaterId: $theaterId)
  }
`

const ADD_SUBSCRIPTION_MUTATION = gql`
  mutation addSubscription($theaterId: ID!) {
    addSubscription(theaterId: $theaterId)
  }
`

const REMOVE_SUBSCRIPTION_MUTATION = gql`
  mutation removeSubscriptionFromTheater($theaterId: ID!) {
    removeSubscription(theaterId: $theaterId)
  }
`

const IS_SUBSCRIBED_QUERY = gql`
  query isSubscribed($theaterId: ID!) {
    isSubscribed(theaterId: $theaterId)
  }
`

const Email = ({ theaterId }: { theaterId: string }) => {
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [subscribe] = useMutation(MUTATION)

  const onSubmit = async (email: string) => {
    setLoading(true)
    try {
      await subscribe({ variables: { email, theaterId } })
      setSubscribed(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SubscribeForm
      onSubmit={onSubmit}
      loading={loading}
      subscribed={subscribed}
    />
  )
}

export const Subscribe = ({ theaterId }: { theaterId: string }) => {
  const loggedIn = !!useContext(Context).token
  if (!loggedIn) return <Email theaterId={theaterId} />

  const { data } = useQuery<isSubscribed, isSubscribedVariables>(
    IS_SUBSCRIBED_QUERY,
    { variables: { theaterId }, fetchPolicy: 'cache-and-network' }
  )

  const subscribed = data && data.isSubscribed

  const [subscribe] = useMutation<addSubscription, addSubscriptionVariables>(
    ADD_SUBSCRIPTION_MUTATION,
    {
      refetchQueries: [
        { query: IS_SUBSCRIBED_QUERY, variables: { theaterId } },
      ],
    }
  )

  const [unsubscribe] = useMutation<
    removeSubscriptionFromTheater,
    removeSubscriptionFromTheaterVariables
  >(REMOVE_SUBSCRIPTION_MUTATION, {
    refetchQueries: [{ query: IS_SUBSCRIBED_QUERY, variables: { theaterId } }],
  })

  const button = (
    <Button
      onClick={() =>
        subscribed
          ? unsubscribe({ variables: { theaterId } })
          : subscribe({ variables: { theaterId } })
      }
      circular
      basic
      size="tiny"
    >
      {subscribed ? (
        <>
          <Icon name="star" color="yellow" />
          <FormattedMessage id="modules.theaters.subscribe.subscribed" />
        </>
      ) : (
        <>
          <Icon name="star outline" color="black" />
          <FormattedMessage id="modules.theaters.subscribe.subscribe" />
        </>
      )}
    </Button>
  )

  return (
    <Popup
      trigger={button}
      content={
        subscribed ? (
          <FormattedMessage id="modules.theaters.subscribe.subscribedDescription" />
        ) : (
          <FormattedMessage id="modules.theaters.subscribe.subscribeDescription" />
        )
      }
      position="right center"
    />
  )
}
