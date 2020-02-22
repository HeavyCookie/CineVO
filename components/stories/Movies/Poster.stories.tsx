import React from 'react'

import Poster from '../../src/Movies/Poster'

export default {
  title: 'Movie/Poster',
  component: Poster,
}

export const Default = () => (
  <Poster
    url="https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg"
    name="Captain Marvel"
  />
)

export const WithCustomWidth = () => (
  <Poster
    url="https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg"
    name="Captain Marvel"
    maxWidth="400px"
  />
)
WithCustomWidth.story = { name: 'With custom width' }

export const Animated = () => (
  <Poster
    url="https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg"
    name="Captain Marvel"
    animated
  />
)
