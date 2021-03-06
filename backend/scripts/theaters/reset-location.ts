import { createConnection, getRepository } from 'typeorm'

import { Theater } from '../../src/entity/Theater'

export default async () => {
  await createConnection()
  const repository = getRepository(Theater)

  const theaters = await repository.find()
  theaters.map(async theater => {
    await repository.save({
      ...theater,
      location: { lat: 0, lon: 0 },
    })
    // eslint-disable-next-line
    // @ts-ignore
    await repository.save({ ...theater, location: null })
  })
}
