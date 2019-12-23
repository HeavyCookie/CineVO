import * as React from 'react'

import { Movie as MovieEntity } from '../entity/Movie'
import { Screening } from '../entity/Screening'
import { Subscriber } from '../entity/Subscriber'

import { Layout } from './Layout'
import { Movie } from './Movie'

export type Props = {
  subscriber: Subscriber
  dates: [Date, Date]
  movies: MovieEntity[]
  screenings: { [key: string]: Screening[] }
}

export const Newsletter = (props: Props) => (
  <Layout dates={props.dates} subscriber={props.subscriber}>
    {props.movies.map(movie => (
      <Movie key={movie.id} movie={movie} screenings={props.screenings} />
    ))}
  </Layout>
)
