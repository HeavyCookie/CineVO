import { EntityRepository, Repository } from 'typeorm'

import { Movie } from '@/entity/Movie'
import { getWeek } from '@/lib/theater-weeks'

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  public getTheaterScreenings(theaterId: string, week = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .leftJoin('screening.theater', 'theater')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .andWhere('theater.id = :id', { id: theaterId })
      .getMany()
  }

  public getTheaterMovieCount(theaterId: string, week = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .leftJoin('screening.theater', 'theater')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .andWhere('theater.id = :id', { id: theaterId })
      .getCount()
  }

  public getMoviesAndScreeningsForWeek(week = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getMany()
  }

  public countMoviesForWeek(week = 0) {
    const [start, end] = getWeek(week)
    return this.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.screenings', 'screening')
      .where('screening.date BETWEEN :start AND :end', { start, end })
      .getCount()
  }
}
