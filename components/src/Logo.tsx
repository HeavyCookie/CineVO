import * as React from 'react'
import { Text, StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    color: 'white',
    backgroundColor: 'red',
    fontSize: 40,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowColor: 'rgba(0,0,0,0.25)'
  }
})

export const Logo = () => <Text style={style.container}>CineV0</Text>
