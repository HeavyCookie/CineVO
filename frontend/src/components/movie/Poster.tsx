import React from 'react'
import styled from 'styled-components';

export type Props = {
  /** URL of the poster */
  url: string
  /** Name of the movie */
  name?: string
}

export const Poster = ({url}: Props) => (<img src={url} />)
