import { getManager, MoreThan, getRepository, QueryFailedError } from 'typeorm'
import { zonedTimeToUtc } from 'date-fns-tz'

import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { Theater } from '../entity/Theater'

import { searchMovie } from './tmdb'
import { getTheaterShowtimes } from './allocine/api'
import { Showtime } from './allocine/showtimes'
import { Movie as AMovie } from './allocine/movie'

const runtimeToInt = (runtime: string): number => {
  let duration = 0

  const hours = runtime.match(/(\d+)h/)
  const minutes = runtime.match(/(\d+)min/)

  if (hours) duration += parseInt(hours[1]) * 60 * 60
  if (minutes) duration += parseInt(hours?.[1] || '0') * 60

  return duration
}

const allocineToMovie = async (amovie: AMovie): Promise<Movie> => {
  const actors = amovie.cast.map(person => {
    if (person.actor) {
      return `${person.actor.firstName} ${person.actor.lastName}`
    } else if (person.originalVoiceActor) {
      return `${person.originalVoiceActor.firstName} ${person.originalVoiceActor.lastName}`
    } else if (person.voiceActor) {
      return `${person.voiceActor.firstName} ${person.voiceActor.lastName}`
    }
  })
  const directors = amovie.credits
    .filter(person => person.position.name == 'DIRECTOR')
    .map(person => `${person.person.firstName} ${person.person.lastName}`)

  const release =
    (amovie.releases?.[0] && new Date(amovie.releases[0].releaseDate.date)) ||
    new Date()

  const tmdb = await searchMovie(amovie.title, release)
  const tmdbMovie = tmdb.results[0]

  return Object.assign(new Movie(), {
    allocineId: amovie.internalId,
    actors: actors,
    directors: directors,
    plot: amovie.synopsisFull,
    runtime: runtimeToInt(amovie.runtime),
    pressRatings: amovie.stats.pressReview && amovie.stats.pressReview.score,
    userRatings: amovie.stats.userRating && amovie.stats.userRating.score,
    title: amovie.originalTitle,
    poster:
      (amovie.poster && amovie.poster.url) ||
      (tmdbMovie &&
        tmdbMovie.poster_path &&
        'http://image.tmdb.org/t/p/original' + tmdbMovie.poster_path),
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

const createScreenings = async (
  movie: Movie,
  theater: Theater,
  screenings: Showtime[]
) =>
  screenings.map(async src => {
    try {
      await getManager().insert(Screening, {
        movie,
        theater,
        date: zonedTimeToUtc(src.startsAt, 'Europe/Paris'),
      })
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        err.message.includes('duplicate key value violates unique constraint')
      )
        console.log('Screening already exists')
      else console.error(err)
    }
  })

const refreshTheaterScreenings = async (theater: Theater) => {
  for (let day = 0; day < 30; day++) {
    const showtimes = (await getTheaterShowtimes(theater.allocineCode, day))
      .data.results

    await Promise.all(
      showtimes
        .filter(showtime => showtime.showtimes.original.length > 0)
        .map(async showtime => {
          const amovie = showtime.movie
          const movie = await findOrCreateMovie(amovie)
          await createScreenings(movie, theater, showtime.showtimes.original)
          return movie
        })
    )
  }
}

export const refreshMoviesFromAllocine = async () => {
  await getManager().delete(Screening, { date: MoreThan(new Date()) })

  const theaters = await getRepository(Theater).find()
  for (const theater of theaters) {
    await refreshTheaterScreenings(theater)
  }
  return true
}
