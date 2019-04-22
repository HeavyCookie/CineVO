import { schedule } from 'node-cron'
import { getRepository, getCustomRepository } from 'typeorm'
import { Subscriber } from '../entity/Subscriber'
import { MovieRepository } from '../repositories/MovieRepository'
import { htmlNewsletter } from '../lib/newsletter'
import { getWeek } from '../lib/theater-weeks'
import { Movie } from '../entity/Movie'
import { sendMail } from '../config/mailer'

const getMoviesAndScreenings = () =>
  getCustomRepository(MovieRepository).getMoviesAndScreeningsForWeek(0)

const getAndGroupScreeningsByMovieId = async (movies: Movie[]) => {
  const screenings = await Promise.all(movies.map(movie => movie.screenings))
  return screenings.flat().reduce((acc, screening) => {
    if (!acc[screening.movieId]) acc[screening.movieId] = [screening]
    else acc[screening.movieId] = [...acc[screening.movieId], screening]
    return acc
  }, {})
}

const getSubscribers = () =>
  getRepository(Subscriber)
    .createQueryBuilder('subscriber')
    .select('subscriber.email')
    .getMany()

export const sendNewsletter = async () => {
  const movies = await getMoviesAndScreenings()
  if (movies.length === 0) return console.info('No movie this week')

  const screeningsByMovie = await getAndGroupScreeningsByMovieId(movies)
  const subscribers = await getSubscribers()
  const dates = getWeek(0)

  console.log(`Sending newsletter to ${subscribers.length} people`)

  subscribers.forEach(async subscriber => {
    await sendMail(
      subscriber.email,
      'Séances de la semaine',
      await htmlNewsletter(dates, movies, screeningsByMovie)
    )
  })
}

schedule('0 0 5 * * 3', sendNewsletter)
