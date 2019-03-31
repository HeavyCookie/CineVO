import React from 'react'
import { Props as PosterProps, Poster } from './Poster'
import styled from 'styled-components'

type ContainerProps = {
  moviesPerLine: number
}

const Container = styled.div`
  display: grid;
  grid-template-columns: ${(p: ContainerProps) =>
    '1fr '.repeat(p.moviesPerLine)};

  & > * {
    width: 100%;
  }
`

type Props = {
  movies: PosterProps[]
  moviesPerLine: number
}

export const Wall = ({ movies, moviesPerLine }: Props) => (
  <Container moviesPerLine={moviesPerLine}>
    {movies.map((movie, i) => (
      <Poster key={i} {...movie} />
    ))}
  </Container>
)
