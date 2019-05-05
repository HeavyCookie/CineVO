import { EntityRepository, Repository } from 'typeorm'
import { Movie } from '../entity/Movie'
import { getWeek } from '../lib/theater-weeks'

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  public getMoviesAndScreeningsForWeek(week: number = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getMany()
  }

  public countMoviesForWeek(week: number = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getCount()
  }
}
