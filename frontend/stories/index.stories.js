import React from 'react'

import { storiesOf, addDecorator } from '@storybook/react'
import * as Knob from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { IntlProvider } from 'react-intl'
import { GlobalStyle } from '../src/components/GlobalStyle'

import { Poster } from '../src/components/movie/Poster'
import { Full } from '../src/components/movie/Full'
import { DefaultView } from '../src/components/DefaultView'

addDecorator(story => (
  <IntlProvider locale="fr">
    <>
      <GlobalStyle />
      {story()}
    </>
  </IntlProvider>
))

storiesOf('Movie/Poster', module)
  .addDecorator(Knob.withKnobs)
  .add('default', () => (
    <Poster
      url="https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg"
      name="Captain Marvel"
    />
  ))

storiesOf('Movie/Full', module).add('default', () => (
  <Full
    movie={{
      name: 'Captain Marvel',
      poster:
        'https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
      actors: ['Brie Larson', 'Samuel L. Jackson'],
      directors: ['Anna Boden', 'Ryan Fleck'],
      runtime: 124,
      synopsis:
        'The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.',
    }}
    close={action('clicked-outside')}
  />
))

storiesOf('Home', module).add('default', () => <DefaultView />)
