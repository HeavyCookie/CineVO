import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { Context } from '../context'

export const Logout = () => {
  const { setToken } = useContext(Context)
  if (typeof window != 'undefined') {
    setToken()
  }
  return <Redirect to="/" />
}
