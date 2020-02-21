import { client } from '@/config/elastic-search'

import { mappings } from '.'

const getMetadatas = (klass: object) => {
  const mapping = mappings.get(klass)
  if (!mapping) throw new Error('Empty mapping')
  return mapping
}

export const indexName = (index: string) =>
  `${process.env.NODE_ENV || 'development'}_${index}`

export const remove = (klass: object) =>
  client.indices.delete({ index: indexName(getMetadatas(klass).name) })

export const create = (klass: object) => {
  const metadatas = getMetadatas(klass)
  if (metadatas)
    return client.indices.create({
      index: indexName(metadatas.name),
      body: {
        mappings: {
          properties: Object.fromEntries(metadatas.fields.entries()),
        },
      },
    })
}

export const exists = async (klass: object) => {
  const index = indexName(getMetadatas(klass).name)
  try {
    await client.indices.getMapping({ index })
    return true
  } catch (error) {
    if (error.meta.body.error.type == 'index_not_found_exception') {
      return false
    } else throw error
  }
}

export const index = async (instance: any) => {
  const mapping = getMetadatas(instance.constructor)
  if (!mapping) return

  await client.index({
    index: indexName(mapping.name),
    id: instance?.id,
    body: instance,
  })
  return instance
}
