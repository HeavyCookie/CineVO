import { Resolver, Query, Arg, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ScreeningRepository } from '../repositories/ScreeningRepository'
import { Screening } from '../entity/Screening'

@Resolver(() => Screening)
export class ScreeningResolver {
  public constructor(
    @InjectRepository(ScreeningRepository)
    private readonly screeningRepository: ScreeningRepository
  ) {}

  @Query(() => [Screening])
  public async getScreenings(
    @Arg('movieId', () => ID) movieId: string,
    @Arg('theaterId', () => ID) theaterId: string
  ) {
    return await this.screeningRepository.find({
      theaterId,
      movieId,
    })
  }
}
