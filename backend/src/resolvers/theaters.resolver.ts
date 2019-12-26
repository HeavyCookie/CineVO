import { Resolver, Query, Arg, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { TheaterRepository } from '../repositories/TheaterRepository'
import { Theater } from '../entity/Theater'

@Resolver(() => Theater)
export class TheaterResolver {
  public constructor(
    @InjectRepository(TheaterRepository)
    private readonly theaterRepository: TheaterRepository
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
  public async listTheater() {
    return await this.theaterRepository.find()
  }
}
