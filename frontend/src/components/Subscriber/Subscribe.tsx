import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useFormatMessage } from '@comparaonline/react-intl-hooks'
import { Input } from 'semantic-ui-react'

type Props = {
  onSubmit: (email: string) => any
  loading: boolean
  subscribed: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Succeeded = styled.div`
  margin: 1em;
  text-align: center;
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  max-width: 300px;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 2px;
`

export const Subscribe = (props: Props) => {
  const [email, setEmail] = useState('')
  const t = useFormatMessage()

  useEffect(() => {
    setEmail('')
  }, [props.subscribed])

  return (
    <Container>
      {props.subscribed ? (
        <Succeeded>Vous êtes inscrit, merci !</Succeeded>
      ) : null}
      <Form
        onSubmit={e => {
          e.preventDefault()
          props.onSubmit(email)
        }}
      >
        <Input
          type="email"
          placeholder={t('components.subscriber.subscribe.emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={props.loading}
          action={{
            color: 'red',
            content: t('components.subscriber.subscribe.submit'),
            loading: props.loading,
          }}
        />
      </Form>
    </Container>
  )
}
