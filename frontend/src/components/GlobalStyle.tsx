import { createGlobalStyle } from 'styled-components'
import normalize from 'normalize.css'

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  body {
    font-family: Helvetica, sans-serif;
  }

  p {
    margin-top: 0.6em inherit;
  }
`
