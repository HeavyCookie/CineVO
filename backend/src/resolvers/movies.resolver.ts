import { getRepository } from 'typeorm'
import {
  Resolver,
  Query,
  Arg,
  Int,
  ID,
  FieldResolver,
  Authorized,
  Root,
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Movie } from '../entity/Movie'
import { refreshMoviesFromAllocine } from '../lib/allocine-screenings'
import { MovieRepository } from '../repositories/MovieRepository'
import { getWeek } from '../lib/theater-weeks'
import { CurrentUser } from '../lib/Context'
import { User } from '../entity/User'
import { Subscription } from '../entity/Subscription'
import { Theater } from '../entity/Theater'
import { TheaterRepository } from '../repositories/TheaterRepository'

@Resolver(() => Movie)
export class MovieResolver {
  public constructor(
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository,
    @InjectRepository(TheaterRepository)
    private readonly theaterRepository: TheaterRepository
  ) {}

  @Authorized()
  @FieldResolver(() => [Theater], { nullable: true })
  public async theaters(
    @CurrentUser() currentUser: User,
    @Root() movie: Movie
  ) {
    return await this.theaterRepository
      .createQueryBuilder('theater')
      .leftJoinAndSelect('theater.screenings', 'screening')
      .where('screening.movieId = :movieId', { movieId: movie.id })
      .leftJoin(
        'theater.subscriptions',
        'subscription',
        'subscription.userId = :userId',
        { userId: currentUser.id }
      )
      .getMany()
  }

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
  public async popularMoviesThisWeek(@CurrentUser() currentUser?: User) {
    const [start, end] = getWeek(0)
    const query = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.screenings', 'screening')
      .groupBy('screening.movieId')
      .addGroupBy('movie.id')
      .orderBy('COUNT(screening.movieId)', 'DESC')
      .where('screening.date BETWEEN :start AND :end', { start, end })

    if (currentUser) {
      const theaterIds = (
        await getRepository(Subscription)
          .createQueryBuilder()
          .where({ user: currentUser })
          .select('Subscription.theaterId')
          .getMany()
      ).map(subscription => subscription.theaterId)

      query.andWhere('screening.theaterId IN (:...theaterIds)', { theaterIds })
    }
    return await query.getMany()
  }

  public surroundingMovies: Movie[] | undefined
}
