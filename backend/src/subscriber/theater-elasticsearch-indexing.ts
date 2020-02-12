import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { Theater } from '../entity/Theater'
import { client } from '../config/elastic-search'
import { indexName, index } from '../lib/elastic-search/indices'

@EventSubscriber()
export class TheaterElasticsearchIndexing
  implements EntitySubscriberInterface<Theater> {
  listenTo = () => Theater

  private index = (entity: Theater) => {
    console.log('Indexing theater')

    return index(entity)
  }

  afterInsert = ({ entity }: InsertEvent<Theater>) => this.index(entity)

  afterUpdate = ({ entity }: UpdateEvent<Theater>) => this.index(entity)

  afterRemove = ({ entityId }: RemoveEvent<Theater>) =>
    client.delete({ index: indexName('theater'), id: entityId })
}
