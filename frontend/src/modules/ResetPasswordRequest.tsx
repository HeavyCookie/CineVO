import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'

import {
  resetPasswordRequest,
  resetPasswordRequestVariables,
} from './__generated__/resetPasswordRequest'

const RESET_PASSWORD_REQUEST_MUTATION = gql`
  mutation resetPasswordRequest($email: String!) {
    resetPasswordRequest(email: $email)
  }
`

export const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('')

  const [requestPasswordRequest, { loading, called, data }] = useMutation<
    resetPasswordRequest,
    resetPasswordRequestVariables
  >(RESET_PASSWORD_REQUEST_MUTATION)

  if (called && data?.resetPasswordRequest) {
    return <Redirect to="/" />
  }

  console.log('bla')

  return (
    <Form onSubmit={() => requestPasswordRequest({ variables: { email } })}>
      <Form.Field>
        <label htmlFor="email">
          <FormattedMessage id="modules.resetPasswordRequest.email" />
        </label>
        <input
          id="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
      </Form.Field>
      <Button loading={loading} disabled={loading}>
        <FormattedMessage id="modules.resetPasswordRequest.submit" />
      </Button>
    </Form>
  )
}
