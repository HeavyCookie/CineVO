import React from 'react'
import styled from 'styled-components'

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
}

const Unsubscription = (props: Pick<Props, 'cancelUnsubscription'>) => (
  <>
    <p>Désinscription en cours...</p>
    <button onClick={props.cancelUnsubscription}>Annuler</button>
  </>
)

const Unsubscribed = (props: Pick<Props, 'resubscribe'>) => (
  <>
    <p>
      Vous ne voulez plus être inscrit à nos newsletter ? On est un peu triste,
      mais on comprend !
    </p>
    <p>
      Si c&apos;est une erreur, vous pouvez toujours{' '}
      <ResubscribeButton onClick={props.resubscribe}>
        cliquer ici
      </ResubscribeButton>{' '}
      pour être réinscrit !
    </p>
  </>
)

const Resubscribed = () => (
  <p>
    Aahhhh, on savait qu&apos;on allait vous manquer ! Re-bienvenue à bord !
  </p>
)

const NotFound = () => (
  <p>
    Vous ne semblez pas être présent dans notre base de donnée, ne vous seriez
    vous pas déjà désinscrit ?
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
