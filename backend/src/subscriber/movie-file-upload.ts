import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  getManager,
  UpdateEvent,
} from 'typeorm'

import { Movie } from '../entity/Movie'
import { uploadFileFromUrl } from '../config/file-storage'

type StringProps<T> = {
  [P in keyof T]: T[P] extends string ? P : never
}[keyof T]

type FilesToUpload<T> = Partial<{ [key in StringProps<T>]: string }>

@EventSubscriber()
export class MovieFileUpload implements EntitySubscriberInterface {
  public listenTo = () => Movie

  public static fileFields: StringProps<Movie>[] = ['backdrop', 'poster']

  public static filePath = (id: string | number, field?: string) =>
    ['movies', id, field].join('/')

  public uploadFilesAndUpdateEntity = async (entity: Movie) => {
    if (!entity) return

    const { id } = entity
    const toUpdate = MovieFileUpload.fileFields.reduce((acc, field) => {
      if (!entity[field] || !entity[field].match(/^https?:\/\//)) return acc

      const value = entity[field]
      const filepath = MovieFileUpload.filePath(id, field)
      uploadFileFromUrl(value, filepath)
      acc[field] = filepath
      return acc
    }, {})

    if (Object.keys(toUpdate).length > 0)
      await getManager().update(this.listenTo(), { id }, toUpdate)
  }

  public afterInsert = ({ entity }: InsertEvent<Movie>) =>
    this.uploadFilesAndUpdateEntity(entity)

  public afterUpdate = ({ entity }: UpdateEvent<Movie>) =>
    this.uploadFilesAndUpdateEntity(entity)

  // TODO: Enable file remove on entity remove
  // public afterRemove = ({ entityId }: RemoveEvent<Movie>) => {
  //   let ids = [entityId]

  //   if (entityId instanceof Array) ids = entityId

  //   ids.forEach(id => {
  //     const listing = listFiles(MovieFileUpload.filePath(id))
  //     listing.on('data', item => removeFile([item.prefix, item.name].join('/')))
  //   })
  // }
}
