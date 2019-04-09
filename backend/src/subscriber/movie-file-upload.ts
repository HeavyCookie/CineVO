import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  getManager,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm'
import { Movie } from '../entity/Movie'
import { uploadFileFromUrl } from '../file-storage'

type StringProps<T> = ({
  [P in keyof T]: T[P] extends string ? P : never
})[keyof T]

type FilesToUpload<T> = Partial<{ [key in StringProps<T>]: string }>

@EventSubscriber()
export class MovieFileUpload implements EntitySubscriberInterface {
  public listenTo = () => Movie

  public filesToUpload: FilesToUpload<Movie> = {}
  public static fileFields: (StringProps<Movie>)[] = ['backdrop', 'poster']

  public static filePath = (id: string | number, field?: string) =>
    ['movies', id, field].join('/')

  public gatherPotentialFileFields = (entity: Movie) => {
    if (!entity) return

    MovieFileUpload.fileFields.forEach(field => {
      if (!entity[field] || !entity[field].match(/^https?:\/\//)) return

      this.filesToUpload[field] = entity[field]
      entity[field] = undefined
    })
  }

  public uploadFilesAndUpdateEntity = async (entity: Movie) => {
    if (!entity) return

    const { id } = entity
    const toUpdate = Object.entries(this.filesToUpload).reduce(
      (acc, [field, value]) => {
        const filepath = MovieFileUpload.filePath(id, field)
        uploadFileFromUrl(value, filepath)
        acc[field] = filepath
        return acc
      },
      {}
    )

    await getManager().update(this.listenTo(), { id }, toUpdate)
  }

  public beforeInsert = ({ entity }: InsertEvent<Movie>) =>
    this.gatherPotentialFileFields(entity)

  public afterInsert = ({ entity }: InsertEvent<Movie>) =>
    this.uploadFilesAndUpdateEntity(entity)

  public beforeUpdate = ({ entity }: UpdateEvent<Movie>) =>
    this.gatherPotentialFileFields(entity)

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
