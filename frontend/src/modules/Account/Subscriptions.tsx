import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { Loader, Button, List, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { listSubscriptions } from './__generated__/listSubscriptions'
import {
  removeSubscription,
  removeSubscriptionVariables,
} from './__generated__/removeSubscription'

const LIST_SUBSCRIPTION = gql`
  query listSubscriptions {
    me {
      subscriptions {
        theater {
          id
          name
          street
          postcode
          city
        }
      }
    }
  }
`

const REMOVE_SUBSCRIPTION = gql`
  mutation removeSubscription($theaterId: ID!) {
    removeSubscription(theaterId: $theaterId)
  }
`

export const Subscriptions = () => {
  const { data } = useQuery<listSubscriptions>(LIST_SUBSCRIPTION, {
    fetchPolicy: 'no-cache',
  })
  const [remove] = useMutation<removeSubscription, removeSubscriptionVariables>(
    REMOVE_SUBSCRIPTION,
    {
      refetchQueries: ['listSubscriptions'],
    }
  )

  if (!data || !data.me.subscriptions) return <Loader />

  return (
    <List>
      {data.me.subscriptions.map(({ theater }) => (
        <List.Item key={theater.id} as={Link} to={`/theaters/${theater.id}`}>
          <Icon name="video" />
          <List.Content>
            <List.Header>{theater.name}</List.Header>
            <List.Description>
              <p>
                {theater.street}
                <br />
                {theater.postcode} {theater.city}
              </p>
              <Button
                onClick={() => remove({ variables: { theaterId: theater.id } })}
                size="mini"
              >
                <FormattedMessage id="modules.account.removeTheater" />
              </Button>
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}
