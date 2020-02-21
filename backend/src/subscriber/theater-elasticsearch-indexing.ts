import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'

import { client } from '@/config/elastic-search'
import { Theater } from '@/entity/Theater'
import { indexName, index } from '@/lib/elastic-search/indices'

@EventSubscriber()
export class TheaterElasticsearchIndexing
  implements EntitySubscriberInterface<Theater> {
  listenTo = () => Theater

  private index = (entity: Theater) => {
    // Object is not a theater, so we must cast it before indexing
    return index(Object.assign(new Theater(), entity))
  }

  afterInsert = ({ entity }: InsertEvent<Theater>) => this.index(entity)

  afterUpdate = ({ entity }: UpdateEvent<Theater>) => this.index(entity)

  afterRemove = ({ entityId }: RemoveEvent<Theater>) =>
    client.delete({ index: indexName('theater'), id: entityId })
}
