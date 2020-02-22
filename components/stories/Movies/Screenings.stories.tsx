import React from 'react'

import Screenings from '../../src/Movies/Screenings'

export default {
  title: 'Movie/Screenings',
  component: Screenings,
}

export const Default = () => (
  <Screenings
    data={['2019-03-10 05:30:34', '2019-03-10 20:30:45', '2019-03-30 18:00:10']}
  />
)
