require('dotenv').config({ path: '../.env' })

import 'reflect-metadata'
import * as TypeORM from 'typeorm'
import * as R from 'remeda'

import { Theater } from '../src/entity/Theater'

const theaters: Partial<Theater>[] = [
  {
    name: 'Cinéville Laval',
    allocineCode: 'P1140',
    street: '25 quai Gambetta',
    postcode: 53000,
    city: 'Laval',
  },
  {
    name: 'Le Palace',
    allocineCode: 'W0613',
    street: '3, place du Pilori',
    postcode: 53200,
    city: 'Château-Gontier',
  },
  {
    name: 'Le Vox',
    allocineCode: 'P0295',
    street: '16 place Juhel',
    postcode: 53100,
    city: 'Mayenne',
  },
]

const script = async () => {
  const { manager } = await TypeORM.createConnection()

  try {
    await R.pipe(
      theaters,
      R.map(x => manager.create(Theater, x)),
      manager.save
    )
  } catch (exception) {
    console.error(exception)
  }
}

script()
