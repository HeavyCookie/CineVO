import * as React from 'react'
import { Email } from './Email'
import { Week } from './Week'

const Home = () => {
  return (
    <>
      <Email />
      <Week week={0} />
    </>
  )
}

export default Home
