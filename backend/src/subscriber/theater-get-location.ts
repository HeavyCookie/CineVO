import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'
import Axios from 'axios'
import { FeatureCollection, Feature, Point } from 'geojson'

import { Theater } from '../entity/Theater'

@EventSubscriber()
export class TheaterGetLocation implements EntitySubscriberInterface<Theater> {
  listenTo = () => Theater

  private static locate = async (entity: Theater) => {
    console.log('Searching location for theater')
    if (entity.location) return

    const result = await Axios.get<FeatureCollection>(
      'https://api-adresse.data.gouv.fr/search/',
      {
        params: {
          q: `${entity.street}, ${entity.postcode} ${entity.city}`,
        },
      }
    )

    const { features } = result.data

    const points = features.filter(
      (x): x is Feature<Point> => x.geometry.type == 'Point'
    )
    if (points.length == 0) return

    const [lon, lat] = points[0].geometry.coordinates

    entity.location = { lon, lat }

    return entity
  }

  beforeInsert = async ({ entity }: InsertEvent<Theater>) => {
    if (entity) await TheaterGetLocation.locate(entity)
    else console.debug('Save skipped TheaterGetLocation')
  }

  beforeUpdate = async ({ entity }: UpdateEvent<Theater>) => {
    if (entity) await TheaterGetLocation.locate(entity)
    else console.debug('Save skipped TheaterGetLocation')
  }
}
