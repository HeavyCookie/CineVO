require('dotenv').config({ path: '../.env' })

import { getRepository, createConnection } from 'typeorm'
import * as R from 'remeda'

import { Theater } from '../src/entity/Theater'
import { checkMappings, client, indexName } from '../src/config/elastic-search'

const resetEsIndex = async () => {
  await checkMappings(true)
  await createConnection()
  await R.pipe(
    await getRepository(Theater).find(),
    R.map(x =>
      client.index({ index: indexName('theaters'), id: x.id, body: x })
    ),
    x => Promise.all(x)
  )
}

resetEsIndex()
