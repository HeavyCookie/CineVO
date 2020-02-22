import { CSSReset } from '@chakra-ui/core'
import { Global, css } from '@emotion/core'
import React from 'react'

const style = css`
  body {
    font-family: Helvetica, sans-serif;
  }

  p {
    margin-top: 0.6em inherit;
  }
`

const GlobalStyle = () => (
  <>
    <Global styles={style} />
    <CSSReset />
  </>
)

export default GlobalStyle
