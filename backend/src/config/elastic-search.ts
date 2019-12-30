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
  },
}

const createIndex = (index: string, mapping: Record<string, {}>) =>
  client.indices.create({
    index,
    body: { mappings: { properties: mapping } },
  })

const checkMappings = async () => {
  Object.entries(mappings).map(async ([index, indexMapping]) => {
    try {
      await client.indices.getMapping({ index: index })
      console.log(`Mapping for index ${index} already declared`)
    } catch (error) {
      if (error.meta.body.error.type == 'index_not_found_exception')
        await createIndex(index, indexMapping)
      else console.error(error)
    }
  })
}

checkMappings()
