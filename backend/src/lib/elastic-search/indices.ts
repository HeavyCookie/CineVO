import { client } from '../../config/elastic-search'

import { mappings } from '.'

export const indexName = (index: string) =>
  `${process.env.NODE_ENV || 'development'}_${index}`

export const remove = (klass: Function) =>
  client.indices.delete({ index: indexName(mappings.get(klass).name) })

export const create = (klass: Function) => {
  const metadatas = mappings.get(klass)
  return client.indices.create({
    index: indexName(metadatas.name),
    body: {
      mappings: { properties: Object.fromEntries(metadatas.fields.entries()) },
    },
  })
}

export const exists = async (klass: Function) => {
  const index = indexName(mappings.get(klass).name)
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
  const mapping = mappings.get(instance.constructor)
  if (!mapping) return

  await client.index({
    index: indexName(mapping.name),
    id: instance?.id,
    body: instance,
  })
  return instance
}
