import { Resolver, Query, Arg, Int, ID } from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Movie } from '../entity/Movie'
import { refreshMoviesFromAllocine } from '../lib/allocine-screenings'
import { MovieRepository } from '../repositories/MovieRepository'
import { getWeek } from '../lib/theater-weeks'

@Resolver(() => Movie)
export class MovieResolver {
  public constructor(
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository
  ) {}

  @Query(() => [Movie])
  public movies(
    @Arg('week', () => Int, { defaultValue: 0 }) week: number,
    @Arg('theaterId', () => ID, { nullable: true }) theaterId?: string
  ): Promise<Movie[]> {
    if (!theaterId)
      return this.movieRepository.getMoviesAndScreeningsForWeek(week)

    return this.movieRepository.getTheaterScreenings(theaterId, week)
  }

  @Query(() => Number)
  public async countMoviesForWeek(
    @Arg('week', () => Int, { defaultValue: 0 }) week: number,
    @Arg('theaterId', () => ID, { nullable: true }) theaterId?: string
  ) {
    if (!theaterId) return await this.movieRepository.countMoviesForWeek(week)
    return await this.movieRepository.getTheaterMovieCount(theaterId, week)
  }

  @Query(() => Movie, { nullable: true })
  public movie(@Arg('id', () => ID) id: string): Promise<Movie> {
    return this.movieRepository.findOne(id)
  }

  @Query(() => Boolean)
  public async refreshMovies() {
    await refreshMoviesFromAllocine()
    return true
  }

  @Query(() => [Movie])
  public async popularMoviesThisWeek() {
    const [start, end] = getWeek(0)
    return await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.screenings', 'screening')
      .groupBy('screening.movieId')
      .addGroupBy('movie.id')
      .orderBy('COUNT(screening.movieId)', 'DESC')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getMany()
  }

  public surroundingMovies: Movie[] | undefined
}
