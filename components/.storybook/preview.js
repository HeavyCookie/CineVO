import React from 'react'
import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import GlobalStyle from '../src/GlobalStyle'
import { ThemeProvider } from 'emotion-theming'
import { theme } from '@chakra-ui/core'

addDecorator(withInfo({ inline: true }))

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {storyFn()}
  </ThemeProvider>
))
