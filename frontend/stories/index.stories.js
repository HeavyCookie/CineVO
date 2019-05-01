import React from 'react'

import { storiesOf, addDecorator } from '@storybook/react'
import * as Knob from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { IntlProvider, addLocaleData } from 'react-intl'
import frLocale from 'react-intl/locale-data/fr'
import i18nfr from '../src/i18n/fr'
import { InjectIntlContext } from '@comparaonline/react-intl-hooks'

import { GlobalStyle } from '../src/components/GlobalStyle'

import { Poster, AnimatedPoster } from '../src/components/movie/Poster'
import { Full } from '../src/components/movie/Full'
import { DefaultView } from '../src/components/DefaultView'
import { Screenings } from '../src/components/movie/Screenings'
import { Subscribe } from '../src/components/Subscriber/Subscribe'
import { Unsubscribe } from '../src/components/Subscriber/Unsubscribe'

addLocaleData(frLocale)

addDecorator(story => (
  <IntlProvider locale="fr" messages={i18nfr}>
    <InjectIntlContext>
      <GlobalStyle />
      <div style={{ display: 'flex', justifyContent: 'center' }}>{story()}</div>
    </InjectIntlContext>
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
  .add('animated', () => (
    <AnimatedPoster
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
      backdrop:
        'https://image.tmdb.org/t/p/original/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg',
      actors: ['Brie Larson', 'Samuel L. Jackson'],
      directors: ['Anna Boden', 'Ryan Fleck'],
      runtime: 124 * 60,
      synopsis:
        'The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.',
    }}
    next={'Previous link'}
    previous={'Next link'}
    close={action('clicked-outside')}
  />
))

storiesOf('DefaultView', module).add('default', () => (
  <DefaultView>Content</DefaultView>
))

storiesOf('Movie/Screenings', module).add('default', () => (
  <Screenings
    data={['2019-03-10 05:30:34', '2019-03-10 20:30:45', '2019-03-30 18:00:10']}
  />
))

storiesOf('Subscriber/Subscribe', module)
  .add('default', () => <Subscribe onSubmit={action('submitted')} />)
  .add('sending', () => <Subscribe onSubmit={action('submitted')} loading />)
  .add('subscribed', () => (
    <Subscribe onSubmit={action('submitted')} subscribed />
  ))

storiesOf('Subscriber/Unsubscribe', module)
  .add('inProgress', () => (
    <Unsubscribe
      resubscribe={action('resubscribe')}
      cancelUnsubscription={action('cancelUnsubscription')}
    />
  ))
  .add('unsubscribed', () => (
    <Unsubscribe
      resubscribe={action('resubscribe')}
      cancelUnsubscription={action('cancelUnsubscription')}
      unsubscribed
    />
  ))
  .add('resubscribed', () => (
    <Unsubscribe
      resubscribe={action('resubscribe')}
      cancelUnsubscription={action('cancelUnsubscription')}
      resubscribed
    />
  ))
