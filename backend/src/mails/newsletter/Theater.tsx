import * as React from 'react'
import * as R from 'remeda'
import { MjmlSection, MjmlHero, MjmlText } from 'mjml-react'

import { Theater as TheaterEntity } from '../../entity/Theater'

import { Movie } from './Movie'

type Props = {
  theater: TheaterEntity
}

export const Theater = ({ theater }: Props) => {
  const screeningsByMovieIds = R.groupBy(
    theater.screenings,
    screening => screening.movie.id
  )

  const moviesById = R.pipe(
    theater.screenings,
    R.map(x => x.movie),
    R.indexBy(x => x.id)
  )

  return (
    <>
      <MjmlHero>
        <MjmlText align="center" fontSize="18px">
          {theater.name}
        </MjmlText>
        <MjmlText align="center">
          {theater.street} {theater.postcode} {theater.city}
        </MjmlText>
      </MjmlHero>
      <MjmlSection backgroundColor="#fff">
        {Object.values(moviesById).map(movie => (
          <Movie
            key={movie.id}
            movie={movie}
            screenings={screeningsByMovieIds}
          />
        ))}
      </MjmlSection>
    </>
  )
}
