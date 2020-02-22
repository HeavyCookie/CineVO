import { AspectRatioBox, Image } from '@chakra-ui/core'
import { css } from '@emotion/core'
import React from 'react'

export type Props = {
  /** URL of the poster */
  url?: string
  /** Name of the movie */
  name: string
  /** CSS max-width */
  maxWidth?: string
  animated?: boolean
}

const animation = css`
  transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`

const Poster = ({
  url,
  name,
  maxWidth = '200px',
  animated,
  ...props
}: Props) => (
  <AspectRatioBox ratio={3 / 4} maxW={maxWidth} {...props}>
    <Image src={url} alt={name} objectFit="cover" css={animated && animation} />
  </AspectRatioBox>
)

export default Poster
