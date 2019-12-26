import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { Theater } from '../entity/Theater'
import { client } from '../config/elastic-search'

@EventSubscriber()
export class TheaterElasticsearchIndexing
  implements EntitySubscriberInterface<Theater> {
  listenTo = () => Theater

  afterInsert = ({ entity }: InsertEvent<Theater>) =>
    client.index({
      index: 'theaters',
      id: entity.id,
      body: { ...entity, postcode: entity.postcode.toString() },
    })

  afterUpdate = ({ entity }: UpdateEvent<Theater>) =>
    client.index({
      index: 'theaters',
      id: entity.id,
      body: { ...entity, postcode: entity.postcode.toString() },
    })

  afterRemove = ({ entityId }: RemoveEvent<Theater>) =>
    client.delete({ index: 'theaters', id: entityId })
}
