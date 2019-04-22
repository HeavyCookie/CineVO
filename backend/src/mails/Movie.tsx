import * as React from 'react'
import { MjmlColumn, MjmlImage, MjmlText } from 'mjml-react'
import { Screenings } from './screenings'
import { Movie as MovieEntity } from '../entity/Movie'
import { Screening as ScreeningEntity } from '../entity/Screening'

type Props = {
  movie: MovieEntity
  screenings: { [key: string]: ScreeningEntity[] }
}

export const Movie = ({ movie, screenings }: Props) => {
  return (
    <MjmlColumn width="33%">
      <MjmlImage src={movie.posterUrl()} />
      <MjmlText align="center" font-weight="bold">
        {movie.title}
      </MjmlText>
      <MjmlText>{movie.plot}</MjmlText>
      <Screenings list={screenings[movie.id]} />
    </MjmlColumn>
  )
}
