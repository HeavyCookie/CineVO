require('dotenv').config({ path: '../.env' })

import * as TypeORM from 'typeorm'
import * as R from 'remeda'

import { client } from '../../src/config/elastic-search'
import {
  indexName,
  remove,
  create,
  exists,
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

      const index = indexName(mapping.name)
      if (await exists(table.target)) await remove(table.target)

      try {
        await create(table.target)
      } catch (e) {
        console.log(e.meta.body.error)
      }

      const entities = await TypeORM.getRepository(table.target).find()

      const promises = entities.map(
        async (entity: { id?: string }) =>
          await client.index({
            index,
            id: entity?.id,
            body: entity,
          })
      )
      return Promise.all(promises)
    }),
    x => Promise.all(x)
  )
}
