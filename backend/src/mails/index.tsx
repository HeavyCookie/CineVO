require('dotenv').config({ path: '../.env' })

import * as Koa from 'koa'
import {
  createConnection,
  getCustomRepository,
  getConnection,
  getRepository,
} from 'typeorm'
import { htmlNewsletter } from '../lib/newsletter'
import { MovieRepository } from '../repositories/MovieRepository'
import { getWeek } from '../lib/theater-weeks'
import { Subscriber } from '../entity/Subscriber'

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

  const subscriber = await getRepository(Subscriber).findOneOrFail()

  ctx.body = await htmlNewsletter(subscriber, dates, movies, screeningsByMovies)
})

console.log('http://localhost:3333')
app.listen(3333)
