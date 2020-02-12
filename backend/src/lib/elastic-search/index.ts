import 'reflect-metadata'

type ClassMetadata = {
  prototype: Function
  name: string
  fields: Map<string, { type: string }>
}

export const mappings = new Map<Function, ClassMetadata>()
export const fieldMappings: Map<
  Function,
  Map<string, { type: string }>
> = new Map()

export const Indexable = (name?: string): ClassDecorator => target => {
  mappings.set(target, {
    prototype: target,
    name: name || target.name.toLowerCase(),
    fields: fieldMappings.get(target.prototype),
  })
}

type Types = 'text' | 'geo_point' | 'date'

export const Indexed = (type?: Types): PropertyDecorator => (
  target: Function,
  property: string
) => {
  const currentMapping = fieldMappings.get(target) ?? new Map()
  currentMapping.set(property, { type })
  fieldMappings.set(target, currentMapping)
}
