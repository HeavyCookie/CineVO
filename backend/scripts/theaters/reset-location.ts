require('dotenv').config({ path: '../.env' })

import { createConnection, getRepository } from 'typeorm'

import { Theater } from '../../src/entity/Theater'

const script = async () => {
  await createConnection()
  const repository = getRepository(Theater)

  const theaters = await repository.find()
  theaters.map(async theater => {
    await repository.save({
      ...theater,
      location: { lat: 0, lon: 0 },
    })
    await repository.save({ ...theater, location: null })
  })
}

script()
