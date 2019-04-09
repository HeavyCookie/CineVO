import * as React from 'react'
import styled from 'styled-components'
import { StandardLonghandProperties } from 'csstype'

const Container = styled.div`
  position: relative;
  display: inline-block;
`

const Image = styled.img`
  display: block;
`

export type Props = {
  /** URL of the poster */
  url: string | null
  /** Name of the movie */
  name: string

  maxWidth?: StandardLonghandProperties<React.Key>['maxWidth']
  maxHeight?: StandardLonghandProperties<React.Key>['maxHeight']
}

export const Poster = ({ url, name, maxWidth = 200, maxHeight }: Props) => (
  <Container>
    <Image
      src={url || undefined}
      alt={`Poster du film ${name}`}
      style={{ maxWidth, maxHeight }}
    />
  </Container>
)
