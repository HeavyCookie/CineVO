import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

import { Subscribe } from '../../components/Subscriber/Subscribe'

const MUTATION = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribe(subscriber: { email: $email })
  }
`

export const Email = () => {
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [subscribe] = useMutation(MUTATION)

  const onSubmit = async (email: string) => {
    setLoading(true)
    try {
      await subscribe({ variables: { email } })
      setSubscribed(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Subscribe onSubmit={onSubmit} loading={loading} subscribed={subscribed} />
  )
}
