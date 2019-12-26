import React, { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'

import { Context } from '../../context'

import {
  updateAccount,
  updateAccountVariables,
} from './__generated__/updateAccount'
import { getAccount } from './__generated__/getAccount'
import { Subscriptions } from './Subscriptions'

const UPDATE_ACCOUNT = gql`
  mutation updateAccount($account: ProfileUpdate!) {
    updateAccount(account: $account) {
      id
      email
    }
  }
`

const ME = gql`
  query getAccount {
    me {
      id
      email
    }
  }
`

export const Account = () => {
  if (!useContext(Context).token) return null

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const { data } = useQuery<getAccount>(ME)

  useEffect(() => {
    if (data) setEmail(data.me.email)
  }, [data && data.me.email])

  const [updateAccountAction, { loading }] = useMutation<
    updateAccount,
    updateAccountVariables
  >(UPDATE_ACCOUNT)

  return (
    <>
      <Form
        onSubmit={() => {
          updateAccountAction({ variables: { account: { email, password } } })
        }}
      >
        <Form.Field>
          <label htmlFor="email">
            <FormattedMessage id="modules.account.fields.email" />
          </label>
          <input
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email || ''}
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="password">
            <FormattedMessage id="modules.account.fields.password" />
          </label>
          <input
            id="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password || ''}
          />
        </Form.Field>
        <Button type="submit" disabled={loading} loading={loading}>
          <FormattedMessage id="modules.account.submit" />
        </Button>
      </Form>
      <Subscriptions />
    </>
  )
}
