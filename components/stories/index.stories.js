import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'
import { Logo } from '../src/Logo'
import { Poster } from '../src/Movie/Poster'
import { Detail } from '../src/Movie/Detail'
import { View } from 'react-native'

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
))

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ))

storiesOf('Logo', module).add('default', () => <Logo />)

const imgSrc =
  'https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg'
storiesOf('Movie/Poster', module)
  .add('default', () => <Poster source={imgSrc} />)
  .add('with only width', () => <Poster source={imgSrc} width={300} />)
  .add('with only height', () => <Poster source={imgSrc} height={100} />)

storiesOf('Movie/Detail', module).add('default', () => (
  <View style={{ backgroundColor: 'blue' }}>
    <Detail />
  </View>
))
