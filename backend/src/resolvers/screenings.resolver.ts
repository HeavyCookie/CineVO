import { Resolver, Query, Arg, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Screening } from '@/entity/Screening'
import { ScreeningRepository } from '@/repositories/ScreeningRepository'

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
