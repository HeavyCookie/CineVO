import React from 'react'

import Full from '../../src/Movies/Full'

export default {
  title: 'Movie/Full',
  component: Full,
}

export const Default = () => (
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
    // close={}
  />
)
