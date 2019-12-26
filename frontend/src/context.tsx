import React, { useState, useEffect } from 'react'

export const getToken = () => {
  if (typeof window == 'undefined') return undefined

  return localStorage.getItem('token') || undefined
}

const useToken = (): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>
] => {
  const [token, setToken] = useState(getToken())

  useEffect(() => {
    if (typeof window == 'undefined') return
    token
      ? localStorage.setItem('token', token)
      : localStorage.removeItem('token')
  }, [token])

  return [token, setToken]
}

export const Context = React.createContext({
  token: getToken(),
  setToken: (token?: string) => {
    console.log(`Token ${token} not setted because there is no context`)
  },
})

export const TokenProvider = (props: { children: React.ReactNode }) => {
  const [token, setToken] = useToken()

  return (
    <Context.Provider value={{ token, setToken: t => setToken(t) }}>
      {props.children}
    </Context.Provider>
  )
}
