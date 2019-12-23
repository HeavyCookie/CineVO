import { Movie } from "./movie";

export interface Showtime {
  internalId: number
  /* ISO Date */
  startsAt: string
}

interface Result {
  movie: Movie
  showtimes: {
    original: Showtime[]
    dubbed: Showtime[]
    local: Showtime[]
    multiple: Showtime[]
  }
}

export interface ShowtimesEndpoint {
  results: Result[]
}
