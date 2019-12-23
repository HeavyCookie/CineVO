import * as React from 'react'
import styled from '@emotion/styled'
import { StandardLonghandProperties } from 'csstype'
import { animated, useSpring, config } from 'react-spring'
import { Loader } from 'semantic-ui-react'
import { useIntl } from 'react-intl'

const Container = styled.div`
  display: inline-block;
  vertical-align: middle;
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

export const Poster = ({ url, name, maxWidth = 200, maxHeight }: Props) => {
  const { formatMessage: t } = useIntl()

  return (
    <Container>
      <Image
        src={url || undefined}
        alt={t({ id: 'components.movie.poster.title' }, { movieName: name })}
        style={{ maxWidth, maxHeight }}
      />
    </Container>
  )
}

export const AnimatedPoster = (props: Props) => {
  const [hover, setHover] = React.useState(false)
  const style = useSpring({ scale: hover ? 1 : 0.9, config: config.wobbly })
  return (
    <animated.div
      style={{
        transform: style.scale.interpolate(scale => `scale(${scale})`),
        display: 'inline-block',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Poster {...props} />
    </animated.div>
  )
}

export const Wall = styled.div`
  display: flex;
  justify-content: center;
`

export const WallLoaderContainer = styled.div`
  display: flex;
  margin: 4em;
`

export const WallLoader = () => {
  const { formatMessage: t } = useIntl()

  return (
    <WallLoaderContainer>
      <Loader inline active content={t({ id: 'loading' })} />
    </WallLoaderContainer>
  )
}
