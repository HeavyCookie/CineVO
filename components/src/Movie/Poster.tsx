import * as React from 'react'
import { Image, StyleProp, ImageStyle } from 'react-native'

type Props = {
  source: string
  width?: number
  height?: number
}

const style = ({
  height: chosenHeight,
  width: chosenWidth,
}: Props): StyleProp<ImageStyle> => {
  const width = chosenWidth || 200
  const height = chosenHeight || 300
  return {
    height: chosenHeight || (width * 3) / 2,
    width: chosenWidth || (height * 2) / 3,
    aspectRatio: 2 / 3,
  }
}

export const Poster = (props: Props) => (
  <Image source={{ uri: props.source }} style={style(props)} />
)
