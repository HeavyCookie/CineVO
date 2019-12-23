import React from 'react'
import { Global, css } from '@emotion/core'
import 'semantic-ui-css/semantic.min.css'

const style = css`
  body {
    font-family: Helvetica, sans-serif;
  }

  p {
    margin-top: 0.6em inherit;
  }
`

export const GlobalStyle = (...props: any[]) => (
  <Global styles={style} {...props} />
)
