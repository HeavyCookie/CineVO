require('dotenv').config({ path: '../.env' })

import * as Koa from 'koa'
import { createConnection, getCustomRepository, getConnection } from 'typeorm'
import { htmlNewsletter } from '../lib/newsletter'
import { MovieRepository } from '../repositories/MovieRepository'
import { getWeek } from '../lib/theater-weeks'

const app = new Koa()

app.use(async ctx => {
  try {
    await getConnection()
  } catch {
    await createConnection()
  }

  const movies = await getCustomRepository(
    MovieRepository
  ).getMoviesAndScreeningsForWeek(1)

  const screenings = await Promise.all(movies.map(movie => movie.screenings))
  const screeningsByMovies = screenings.flat().reduce((acc, screening) => {
    if (!acc[screening.movieId]) acc[screening.movieId] = [screening]
    else acc[screening.movieId] = [...acc[screening.movieId], screening]
    return acc
  }, {})

  const dates = getWeek(1)

  ctx.body = await htmlNewsletter(dates, movies, screeningsByMovies)
})

console.log('http://localhost:3333')
app.listen(3333)
