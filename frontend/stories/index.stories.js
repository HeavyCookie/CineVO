import React from 'react'

import { storiesOf } from '@storybook/react'
import * as Knob from '@storybook/addon-knobs'

import { Poster } from '../src/components/movie/Poster'
import { Wall } from '../src/components/movie/Wall'

storiesOf('Movie/Poster', module)
  .addDecorator(Knob.withKnobs)
  .add('default', () => (
    <Poster url="https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg" />
  ))
  .add('Wall', () => (
    <Wall
      movies={new Array(30).fill({
        url: 'https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
      })}
      moviesPerLine={Knob.number('Movies per line', 3)}
    />
  ))
