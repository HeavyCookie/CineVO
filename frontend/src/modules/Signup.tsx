import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { FormattedMessage, useIntl } from 'react-intl'
import { Redirect } from 'react-router-dom'

import { Context } from '../context'

import {
  createAccount,
  createAccountVariables,
} from './__generated__/createAccount'
import Helmet from 'react-helmet'

const CREATE_ACCOUNT = gql`
  mutation createAccount($email: String!, $password: String!) {
    createAccount(email: $email, password: $password) {
      jwt
      success
    }
  }
`

export const Signup = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [create, { loading, called, data }] = useMutation<
    createAccount,
    createAccountVariables
  >(CREATE_ACCOUNT)

  const { setToken } = useContext(Context)

  if (called && data && data.createAccount.success && data.createAccount.jwt) {
    setToken(data.createAccount.jwt)
    return <Redirect to="/" />
  }
  const { formatMessage } = useIntl()

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'modules.signup.title' })}</title>
      </Helmet>
      <Form
        onSubmit={() => {
          create({ variables: { email, password } })
        }}
      >
        <Form.Field>
          <label htmlFor="email">
            <FormattedMessage id="modules.signup.fields.email" />
          </label>
          <input
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email || ''}
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="password">
            <FormattedMessage id="modules.signup.fields.password" />
          </label>
          <input
            id="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password || ''}
          />
        </Form.Field>
        <Button type="submit" disabled={loading} loading={loading}>
          <FormattedMessage id="modules.signup.submit" />
        </Button>
      </Form>
    </>
  )
}
