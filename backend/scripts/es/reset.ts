require('dotenv').config({ path: '../.env' })

import * as TypeORM from 'typeorm'
import * as R from 'remeda'

import {
  remove,
  create,
  exists,
  index,
} from '../../src/lib/elastic-search/indices'
import { mappings } from '../../src/lib/elastic-search'

export default async () => {
  await TypeORM.createConnection()
  await R.pipe(
    TypeORM.getMetadataArgsStorage().tables,
    R.map(async table => {
      if (typeof table.target != 'function') return
      const mapping = mappings.get(table.target)

      if (typeof mapping == 'undefined') return

      if (await exists(table.target)) await remove(table.target)

      await create(table.target)

      const entities = await TypeORM.getRepository<{ id?: string }>(
        table.target
      ).find()

      const promises = entities.map(async entity => await index(entity))
      return Promise.all(promises)
    }),
    x => Promise.all(x)
  )
}
