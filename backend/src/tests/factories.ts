import * as Faker from 'faker'

import { User } from '../entity/User'
import { Movie } from '../entity/Movie'
import { Theater } from '../entity/Theater'

const subscriber = (data: Partial<User> = {}): Partial<User> => ({
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

const theater = (data: Partial<Theater> = {}): Partial<Theater> => ({
  allocineCode: Faker.random.alphaNumeric(10),
  name: Faker.company.companyName(),
  street: Faker.address.streetAddress(),
  postcode: parseInt(Faker.address.zipCode()),
  city: Faker.address.city(),
  ...data,
})

export default { subscriber, movie, theater }
