import { createGlobalStyle } from 'styled-components'
import normalize from 'normalize.css'
// @ts-ignore
import semantic from 'semantic-ui-css/semantic.min.css'

export const GlobalStyle = createGlobalStyle`
  ${semantic}
  body {
    font-family: Helvetica, sans-serif;
  }

  p {
    margin-top: 0.6em inherit;
  }
`
