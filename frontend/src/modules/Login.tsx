import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { Redirect, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { Context } from '../context'

import { login, loginVariables } from './__generated__/login'

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      jwt
    }
  }
`

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setToken } = useContext(Context)

  const [loginAction, { called, loading, data }] = useMutation<
    login,
    loginVariables
  >(LOGIN)

  if (called && data && data.login.success && data.login.jwt) {
    setToken(data.login.jwt)
    return <Redirect to="/" />
  }

  return (
    <Form onSubmit={() => loginAction({ variables: { email, password } })}>
      <Form.Field>
        <label htmlFor="email">
          <FormattedMessage id="modules.login.fields.email" />
        </label>
        <input
          id="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </Form.Field>
      <Form.Field>
        <label htmlFor="password">
          <FormattedMessage id="modules.login.fields.password" />
        </label>
        <input
          id="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
      </Form.Field>
      <Button type="submit" disabled={loading} loading={loading}>
        <FormattedMessage id="modules.login.submit" />
      </Button>
      <Link to="/reset-password">
        <FormattedMessage id="modules.login.forgotPassword" />
      </Link>
    </Form>
  )
}
