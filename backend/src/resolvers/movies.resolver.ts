import { Resolver, Query, Arg, Int } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Movie } from '../entity/Movie'
import { getWeek } from '../lib/theater-weeks'
import { refreshMoviesFromAllocine } from '../lib/allocine-screenings'

@Resolver(() => Movie)
export class MovieResolver {
  public constructor(
    @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>
  ) {}

  @Query(() => [Movie])
  public movies(
    @Arg('week', () => Int, { defaultValue: 0 }) week: number
  ): Promise<Movie[]> {
    const [start, end] = getWeek(week)
    return this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getMany()
  }

  @Query(() => [Movie])
  public async refreshMovies() {
    return await refreshMoviesFromAllocine('P1140')
  }
}
