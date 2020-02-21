import { Client } from '@elastic/elasticsearch'

import { mappings } from '@/lib/elastic-search'
import { exists, create } from '@/lib/elastic-search/indices'

export const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
})

const checkMappings = async () => {
  for (const [key] of mappings) {
    if (!(await exists(key))) create(key)
  }
}

checkMappings()
