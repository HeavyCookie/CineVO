import React, { useState, useContext } from 'react'
import { RouteComponentProps, Redirect } from 'react-router-dom'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { Form, Button } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Context } from '../context'

import {
  resetPassword,
  resetPasswordVariables,
} from './__generated__/resetPassword'
import Helmet from 'react-helmet'

type Props = RouteComponentProps<{ token: string }>

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(password: $password, resetPasswordToken: $token) {
      success
      jwt
    }
  }
`

export const ResetPassword = (props: Props) => {
  const [password, setPassword] = useState('')

  const [changePassword, { loading, data, called }] = useMutation<
    resetPassword,
    resetPasswordVariables
  >(RESET_PASSWORD_MUTATION)

  const { setToken } = useContext(Context)

  if (called && data?.resetPassword.success && data.resetPassword.jwt) {
    setToken(data.resetPassword.jwt)
    return <Redirect to="/" />
  }

  const { formatMessage } = useIntl()

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'modules.resetPassword.title' })}</title>
      </Helmet>
      <Form
        onSubmit={() =>
          changePassword({
            variables: { token: props.match.params.token, password },
          })
        }
      >
        <Form.Field>
          <label htmlFor="password">
            <FormattedMessage id="modules.resetPassword.password" />
          </label>
          <input
            id="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />

          <Button loading={loading} disabled={loading}>
            <FormattedMessage id="modules.resetPassword.submit" />
          </Button>
        </Form.Field>
      </Form>
    </>
  )
}
