import {
  Resolver,
  Query,
  Arg,
  Int,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Movie } from '../entity/Movie'
import { refreshMoviesFromAllocine } from '../lib/allocine-screenings'
import { MovieRepository } from '../repositories/MovieRepository'

@Resolver(() => Movie)
export class MovieResolver {
  public constructor(
    @InjectRepository(MovieRepository)
    private readonly movieRepository: MovieRepository
  ) {}

  @Query(() => [Movie])
  public movies(
    @Arg('week', () => Int, { defaultValue: 0 }) week: number
  ): Promise<Movie[]> {
    return this.movieRepository.getMoviesAndScreeningsForWeek(week)
  }

  @Query(() => Movie, { nullable: true })
  public movie(@Arg('id', () => ID) id: string): Promise<Movie> {
    return this.movieRepository.findOne(id)
  }

  @Query(() => [Movie])
  public async refreshMovies() {
    return await refreshMoviesFromAllocine('P1140')
  }

  public surroundingMovies: Movie[] | undefined

  @FieldResolver(() => Movie, { nullable: true })
  public async next(@Root() movie: Movie): Promise<Movie> {
    if (!this.surroundingMovies)
      this.surroundingMovies = await this.movieRepository.getMoviesAndScreeningsForWeek()
    const currentIndex = this.surroundingMovies.findIndex(m => m.id == movie.id)
    return this.surroundingMovies[currentIndex + 1]
  }

  @FieldResolver(() => Movie, { nullable: true })
  public async previous(@Root() movie: Movie): Promise<Movie> {
    if (!this.surroundingMovies)
      this.surroundingMovies = await this.movieRepository.getMoviesAndScreeningsForWeek()
    const currentIndex = this.surroundingMovies.findIndex(m => m.id == movie.id)
    return this.surroundingMovies[currentIndex - 1]
  }
}
