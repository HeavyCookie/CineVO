import { getManager, MoreThan } from 'typeorm'
import { parse } from 'date-fns'
import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { searchMovie } from './tmdb'
import { getTheaterShowtimes } from './allocine/api'
import { Showtime } from './allocine/showtimes'
import { Movie as AMovie } from './allocine/movie'

const runtimeToInt = (runtime: string): number => {
  let duration = 0

  const hours = runtime.match(/(\d+)h/)
  const minutes = runtime.match(/(\d+)min/)

  if (hours) duration += parseInt(hours[1]) * 60 * 60
  if (minutes) duration += parseInt(hours[1]) * 60

  return duration
}

const allocineToMovie = async (amovie: AMovie): Promise<Movie> => {
  const actors = amovie.cast.map(
    person => {
      if (person.actor) {
        return `${person.actor.firstName} ${person.actor.lastName}`
      } else if (person.originalVoiceActor) {
          return `${person.originalVoiceActor.firstName} ${person.originalVoiceActor.lastName}`
      } else if (person.voiceActor) {
        return `${person.voiceActor.firstName} ${person.voiceActor.lastName}`
      }
    }
  )
  const directors = amovie.credits
    .filter(person => person.position.name == 'DIRECTOR')
    .map(person => `${person.person.firstName} ${person.person.lastName}`)

  const release = new Date(amovie.releases[0].releaseDate.date)

  const tmdb = await searchMovie(amovie.title, release)
  const tmdbMovie = tmdb.results[0]

  return Object.assign(new Movie(), {
    allocineId: amovie.internalId,
    actors: actors,
    directors: directors,
    plot: '',
    runtime: runtimeToInt(amovie.runtime),
    pressRatings: amovie.stats.pressReview && amovie.stats.pressReview.score,
    userRatings: amovie.stats.userRating && amovie.stats.userRating.score,
    title: amovie.originalTitle,
    poster: amovie.poster.url,
    release: release,
    backdrop:
      tmdbMovie &&
      tmdbMovie.backdrop_path &&
      'http://image.tmdb.org/t/p/original' + tmdbMovie.backdrop_path,
  })
}

const findOrCreateMovie = async (amovie: AMovie): Promise<Movie> => {
  const dbMovie = await getManager().findOne(Movie, {
    allocineId: amovie.internalId,
  })
  if (dbMovie) return dbMovie

  const newMovie = await allocineToMovie(amovie)
  await getManager().insert(Movie, newMovie)
  return newMovie
}

const createScreenings = async (movie: Movie, screenings: Showtime[]) =>
  screenings.map(
    async src =>
      await getManager().insert(Screening, {
        movie,
        date: parse(src.startsAt),
      })
  )

export const refreshMoviesFromAllocine = async (code: string) => {
  await getManager().delete(Screening, { date: MoreThan(new Date()) })

  for (let day = 0; day < 30; day++) {
    const showtimes = (await getTheaterShowtimes(code, day)).data.results

    await Promise.all(
      showtimes
        .filter(showtime => showtime.showtimes.original.length > 0)
        .map(async showtime => {
          const amovie = showtime.movie
          const movie = await findOrCreateMovie(amovie)
          await createScreenings(movie, showtime.showtimes.original)
          return movie
        })
    )
  }
}
