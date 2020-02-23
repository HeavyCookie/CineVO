import 'reflect-metadata'

export type ClassMetadata = {
  prototype: object
  name: string
  fields: Map<string, { type: string }>
}

export const mappings = new Map<object, ClassMetadata>()
export const fieldMappings: Map<
  object,
  Map<string, { type: string }>
> = new Map()

export const Indexable = (name?: string): ClassDecorator => target => {
  const fieldMapping = fieldMappings.get(target)
  if (!fieldMapping) throw new Error("Field mapping hasn't been declared")

  mappings.set(target, {
    prototype: target,
    name: name || target.name.toLowerCase(),
    fields: fieldMapping,
  })
}

type Types = 'text' | 'geo_point' | 'date'

export const Indexed = (type?: Types): PropertyDecorator => (
  target, // Function
  property
) => {
  const currentMapping = fieldMappings.get(target.constructor) ?? new Map()
  currentMapping.set(property, { type })
  fieldMappings.set(target.constructor, currentMapping)
}
