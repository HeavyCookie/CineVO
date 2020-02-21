import { getRepository } from 'typeorm'

import { Theater } from '@/entity/Theater'
import { connect, disconnect } from '@/tests/utils'

import { TheaterGetLocation } from './theater-get-location'

beforeAll(connect)
afterAll(disconnect)

describe(TheaterGetLocation, () => {
  it('assign location to theater on save', async () => {
    const repo = getRepository(Theater)

    const theater = repo.create({
      allocineCode: 'blabla',
      city: 'Laval',
      name: 'Cinéville Laval',
      postcode: 53000,
      street: '25 quai Gambetta',
    })

    await repo.save(theater)

    expect(theater.location).not.toBeNull()
  })
})
