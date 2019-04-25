import * as Faker from 'faker'
import { Subscriber } from '../entity/Subscriber'
import { Movie } from '../entity/Movie'

const subscriber = (data: Partial<Subscriber> = {}): Partial<Subscriber> => ({
  email: Faker.internet.email(),
  ...data,
})

const movie = (data: Partial<Movie> = {}): Partial<Movie> => ({
  allocineId: Faker.random.number({ min: 0, max: 999999 }),
  title: Faker.commerce.productName(),
  runtime: Faker.random.number({ min: 15, max: 240 }) * 60,
  release: Faker.date.past(50),
  actors: new Array(Faker.random.number({ min: 1, max: 7 })).map(
    () => `${Faker.name.firstName()} ${Faker.name.lastName()}`
  ),
  directors: new Array(Faker.random.number({ min: 1, max: 2 })).map(
    () => `${Faker.name.firstName()} ${Faker.name.lastName()}`
  ),
  ...data,
})

export default { subscriber, movie }
