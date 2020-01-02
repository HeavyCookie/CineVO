import { EntityRepository, Repository } from 'typeorm'

import { Theater } from '../entity/Theater'
import { getWeek } from '../lib/theater-weeks'
import { client } from '../config/elastic-search'

@EntityRepository(Theater)
export class TheaterRepository extends Repository<Theater> {
  public getTheaterScreenings(theaterId: string, week = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('theater')
      .leftJoinAndSelect('theater.screenings', 'screening')
      .leftJoin('screening.theater', 'theater')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .where('theater.id = :id', { id: theaterId })
      .getMany()
  }

  public async search(query: string) {
    const results = await client.search({
      index: 'theaters',
      body: {
        query: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          multi_match: {
            query,
            fields: ['allocineCode', 'name', 'street', 'city', 'postcode'],
            type: 'phrase_prefix',
          },
        },
      },
    })
    const ids = results.body.hits.hits.map(hit => hit._source.id)
    return await this.findByIds(ids)
  }

  public async index(...theaters: Theater[]) {
    theaters.map(theater =>
      client.index({
        index: 'theaters',
        id: theater.id,
        body: { ...theater, postcode: theater.postcode.toString() },
      })
    )
  }
}
