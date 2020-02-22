import React, { createContext } from 'react'

type LinkProps = { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = (props: LinkProps) => (
  <a href={props.to}>{props.children}</a>
)

const Context = createContext({ Link })

export default Context
