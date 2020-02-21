import { Mjml, MjmlBody, MjmlHero, MjmlText, MjmlButton } from 'mjml-react'
import * as React from 'react'

type Props = {
  token: string
}

export const ResetPassword = (props: Props) => (
  <Mjml>
    <MjmlBody>
      <MjmlHero>
        <MjmlText fontSize="20px" align="center">
          CineVO
        </MjmlText>
      </MjmlHero>
      <MjmlHero>
        <MjmlText>
          Vous avez demander une remise à zéro de votre mot de passe, si ce
          n&apos;est pas de votre fait, ignorez cet email.
        </MjmlText>
        <MjmlButton
          backgroundColor="#db2828"
          color="#FFF"
          align="center"
          href={`${process.env.BASE_URL || ''}/reset-password/${props.token}`}
        >
          Définir un nouveau mot de passe
        </MjmlButton>
      </MjmlHero>
    </MjmlBody>
  </Mjml>
)
