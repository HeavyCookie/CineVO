import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

const Container = styled.div`
  text-align: center;
`

const ResubscribeButton = styled.button`
  padding: 0;
  text-decoration: underline;
  background: none;
  border: none;
`

type Props = {
  cancelUnsubscription: React.EventHandler<React.MouseEvent>
  resubscribe: React.EventHandler<React.MouseEvent>
  resubscribed?: boolean
  unsubscribed?: boolean
  notfound?: boolean
  theaterId: string
}

const Unsubscription = (props: Pick<Props, 'cancelUnsubscription'>) => (
  <>
    <p>
      <FormattedMessage id="components.subscriber.unsubscribe.unsubscription.message" />
    </p>
    <button onClick={props.cancelUnsubscription}>
      <FormattedMessage id="components.subscriber.unsubscribe.unsubscription.cancel" />
    </button>
  </>
)

const Unsubscribed = (props: Pick<Props, 'resubscribe'>) => (
  <>
    <p>
      <FormattedMessage id="components.subscriber.unsubscribe.unsubscribed.message" />
    </p>
    <p>
      <FormattedMessage
        id="components.subscriber.unsubscribe.unsubscribed.cancel"
        values={{
          link: (
            <ResubscribeButton onClick={props.resubscribe}>
              <FormattedMessage id="components.subscriber.unsubscribe.unsubscribed.cancelLink" />
            </ResubscribeButton>
          ),
        }}
      />
    </p>
  </>
)

const Resubscribed = () => (
  <p>
    <FormattedMessage id="components.subscriber.unsubscribe.resubscribed" />
  </p>
)

const NotFound = () => (
  <p>
    <FormattedMessage id="components.subscriber.unsubscribe.notfound" />
  </p>
)

export const Unsubscribe = (props: Props) => {
  let component = (
    <Unsubscription cancelUnsubscription={props.cancelUnsubscription} />
  )
  if (props.unsubscribed) {
    component = <Unsubscribed resubscribe={props.resubscribe} />
  }
  if (props.resubscribed) {
    component = <Resubscribed />
  }
  if (props.notfound) {
    component = <NotFound />
  }
  return <Container>{component}</Container>
}
