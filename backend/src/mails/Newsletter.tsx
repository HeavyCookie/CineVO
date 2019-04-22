import * as React from 'react'
import { Layout } from './layout'
import { Movie } from './movie'
import { Movie as MovieEntity } from '../entity/Movie'
import { Screening } from '../entity/Screening'

export type Props = {
  dates: [Date, Date]
  movies: MovieEntity[]
  screenings: { [key: string]: Screening[] }
}

export const Newsletter = (props: Props) => (
  <Layout dates={props.dates}>
    {props.movies.map(movie => (
      <Movie movie={movie} screenings={props.screenings} />
    ))}
  </Layout>
)
