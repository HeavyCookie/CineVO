import * as TypeORM from 'typeorm'

import { Theater } from '../src/entity/Theater'

export default () => {
  TypeORM.createConnection()
  TypeORM.getManager().save(Theater, {
    name: 'Cinéville Laval',
    allocineCode: 'P1140',
    street: '25 quai Gambetta',
    postcode: 53000,
    city: 'Laval',
  })
  TypeORM.getManager().save(Theater, {
    name: 'Le Palace',
    allocineCode: 'W0613',
    street: '3, place du Pilori',
    postcode: 53200,
    city: 'Château-Gontier',
  })
  TypeORM.getManager().save(Theater, {
    name: 'Le Vox',
    allocineCode: 'P0295',
    street: '16 place Juhel',
    postcode: 53100,
    city: 'Mayenne',
  })
}
