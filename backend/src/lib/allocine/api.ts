import Axios from 'axios'

import { ShowtimesEndpoint } from './showtimes'

export const getTheaterShowtimes = (theaterRef: string, day = 0) =>
  Axios.get<ShowtimesEndpoint>(
    `http://www.allocine.fr/_/showtimes/theater-${theaterRef}/d-${day}`
  )
