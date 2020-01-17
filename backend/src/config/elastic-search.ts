import { Client } from '@elastic/elasticsearch'

export const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
})

const mappings = {
  theaters: {
    id: { type: 'text' },
    allocineCode: { type: 'text' },
    createdAt: { type: 'text' },
    name: { type: 'text' },
    street: { type: 'text' },
    postcode: { type: 'text' },
    city: { type: 'text' },
    location: { type: 'geo_point' },
  },
}

type Indexes = keyof typeof mappings

export const indexName = (index: Indexes) =>
  `${process.env.NODE_ENV || 'development'}_${index}`

const createIndex = (index: Indexes, mapping: Record<string, {}>) =>
  client.indices.create({
    index: indexName(index),
    body: { mappings: { properties: mapping } },
  })

export const checkMappings = async (force = false) => {
  Object.entries(mappings).map(async ([index, indexMapping]) => {
    const castedIndex = index as Indexes
    try {
      if (force) {
        console.debug('Deleting index ', index)
        await client.indices.delete({ index: indexName(castedIndex) })
        console.debug('Index', index, 'deleted')
      }

      console.debug('Getting mappings for index', index)
      await client.indices.getMapping({ index })
      console.debug(`Mapping for index ${index} already declared`)
    } catch (error) {
      if (error.meta.body.error.type == 'index_not_found_exception') {
        await createIndex(castedIndex, indexMapping)
      } else {
        console.error(error)
      }
    }
  })
}

checkMappings()
