import * as Allocine from 'allocine-api'
import { getManager, MoreThan } from 'typeorm'
import { parse } from 'date-fns'
import { Movie } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { searchMovie } from './tmdb'

interface AMovie {
  code: number
  title: string
  castingShort: {
    directors: string
    actors: string
  }
  poster: { path: string; href: string }
  release: { releaseDate: string }
  runtime: number
  statistics: {
    pressRating: number
    pressReviewCount: number
    userRating: number
    userReviewCount: number
    userRatingCount: number
    editorialRatingCount: number
  }
}

interface Scr {
  d: string
  t: { code: number; p: number; $: string }[]
}

interface Showtime {
  preview: 'true' | 'false'
  releaseWeek: 'true' | 'false'
  onShow: { movie: AMovie }
  version: {
    original: 'true' | 'false'
    $: string
  }
  scr: Scr[]
}
export const getScreeningsForTheater = async (
  code: string
): Promise<Showtime[]> =>
  await new Promise((resolve, reject) => {
    Allocine.api('showtimelist', { theaters: code }, (error, result) => {
      if (error) return reject(error)

      resolve(result.feed.theaterShowtimes[0].movieShowtimes)
    })
  })

const allocineToMovie = async (amovie: AMovie): Promise<Movie> => {
  const { actors, directors } = amovie.castingShort
  const release = new Date(amovie.release.releaseDate)

  const tmdb = await searchMovie(amovie.title, release)
  const tmdbMovie = tmdb.results[0]

  return Object.assign(new Movie(), {
    allocineId: amovie.code,
    actors: actors ? actors.split(',') : [],
    directors: directors ? directors.split(',') : [],
    plot: '',
    runtime: amovie.runtime,
    pressRatings: amovie.statistics.pressRating,
    userRatings: amovie.statistics.userRating,
    title: amovie.title,
    poster: amovie.poster.href,
    release: release,
    backdrop:
      tmdbMovie &&
      'http://image.tmdb.org/t/p/original' + tmdbMovie.backdrop_path,
  })
}

const findOrCreateMovie = async (amovie): Promise<Movie> => {
  const dbMovie = await getManager().findOne(Movie, { allocineId: amovie.code })
  if (dbMovie) return dbMovie

  const newMovie = await allocineToMovie(amovie)
  await getManager().insert(Movie, newMovie)
  return newMovie
}

const createScreenings = async (movie: Movie, screenings: Scr[]) =>
  screenings.map(async scr =>
    scr.t.map(
      async ({ $ }) =>
        await getManager().insert(Screening, {
          movie,
          date: parse(`${scr.d} ${$}:00`),
        })
    )
  )

export const refreshMoviesFromAllocine = async (code: string) => {
  const showtimes = await getScreeningsForTheater(code)

  await getManager().delete(Screening, {
    date: MoreThan(new Date()),
  })

  return await Promise.all(
    showtimes
      .filter(showtime => showtime.version.original === 'true')
      .map(async showtime => {
        const amovie = showtime.onShow.movie
        const movie = await findOrCreateMovie(amovie)
        await createScreenings(movie, showtime.scr)
        return movie
      })
  )
}
