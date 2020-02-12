import {
  Resolver,
  Query,
  Arg,
  ID,
  Int,
  ObjectType,
  Field,
  FieldResolver,
  Root,
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import * as R from 'remeda'

import { TheaterRepository } from '../repositories/TheaterRepository'
import { Theater } from '../entity/Theater'
import { client } from '../config/elastic-search'
import { Movie } from '../entity/Movie'
import { MovieRepository } from '../repositories/MovieRepository'
import { getWeek } from '../lib/theater-weeks'
import { indexName } from '../lib/elastic-search/indices'

@ObjectType()
class TheaterDistanceResult {
  @Field({ description: 'Distance from the location provided in search' })
  public distance: number

  @Field({ description: 'Corresponding theater' })
  public theater: Theater
}

@Resolver(() => Theater)
export class TheaterResolver {
  public constructor(
    @InjectRepository(TheaterRepository)
    private readonly theaterRepository: TheaterRepository,
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository
  ) {}

  @Query(() => [Theater])
  public async searchTheater(@Arg('q', () => String) q: string) {
    return await this.theaterRepository.search(q)
  }

  @Query(() => Theater)
  public async getTheater(@Arg('id', () => ID) id: string) {
    return await this.theaterRepository.findOneOrFail(id)
  }

  @Query(() => [Theater])
  public async listTheater(
    @Arg('limit', () => Int, { nullable: true }) limit?: number
  ) {
    const query = this.theaterRepository
      .createQueryBuilder()
      .orderBy('Theater.createdAt', 'DESC')

    if (limit) query.limit(limit)

    return await query.getMany()
  }

  @Query(() => [TheaterDistanceResult])
  // @Query(() => Boolean)
  public async theatersByDistance(
    @Arg('lon') lon: number,
    @Arg('lat') lat: number,
    @Arg('limit', { nullable: true }) limit?: number
  ) {
    /* eslint-disable @typescript-eslint/camelcase */
    let limitQuery = {}
    if (limit) {
      limitQuery = {
        query: {
          bool: {
            must: { match_all: {} },
            filter: {
              geo_distance: { distance: `${limit}km`, location: { lon, lat } },
            },
          },
        },
      }
    }
    const result = await client.search({
      index: indexName('theater'),
      body: {
        ...limitQuery,
        sort: [
          {
            _geo_distance: {
              location: { lon, lat },
              order: 'asc',
              unit: 'km',
              mode: 'min',
              distance_type: 'arc',
              ignore_unmapped: true,
            },
          },
        ],
      },
    })
    /* eslint-enable @typescript-eslint/camelcase */

    const ids = result.body.hits.hits.map(x => x._id) as string[]
    const theatersById = R.pipe(
      await this.theaterRepository
        .createQueryBuilder()
        .whereInIds(ids)
        .getMany(),
      R.indexBy(x => x.id)
    )

    return result.body.hits.hits
      .filter(x => typeof x.sort[0] == 'number')
      .map(x => ({
        ...new TheaterDistanceResult(),
        distance: x.sort[0],
        theater: theatersById[x._id],
      }))
  }

  @FieldResolver(() => [Movie])
  public async movies(@Root() theater: Theater) {
    const [start, end] = getWeek(0)
    return this.movieRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.screenings', 'screening')
      .where('screening.theaterId = :theaterId', { theaterId: theater.id })
      .andWhere('screening.date BETWEEN :start and :end', { start, end })
      .getMany()
  }
}
