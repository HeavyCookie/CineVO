import * as React from 'react'
import { Layout } from './layout'
import { Movie } from './movie'
import { Movie as MovieEntity } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { Subscriber } from '../entity/Subscriber'

export type Props = {
  subscriber: Subscriber
  dates: [Date, Date]
  movies: MovieEntity[]
  screenings: { [key: string]: Screening[] }
}

export const Newsletter = (props: Props) => (
  <Layout dates={props.dates} subscriber={props.subscriber}>
    {props.movies.map(movie => (
      <Movie movie={movie} screenings={props.screenings} />
    ))}
  </Layout>
)
