import React from 'react'
import './Home.css'
import logo from './react.svg'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { getMovies } from './__generated__/getMovies'

const MOVIES = gql`
  query getMovies {
    movies(week: 2) {
      id
      title
    }
  }
`

const Home = () => {
  const { data } = useQuery<getMovies>(MOVIES)

  return (
    <div className="Home">
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>Welcome to Razzle</h2>
      </div>
      <p className="Home-intro">
        To get started, edit <code>src/App.js</code> or <code>src/Home.js</code>{' '}
        and save to reload.
      </p>
      <ul className="Home-resources">
        <li>
          <a href="https://github.com/jaredpalmer/razzle">Docs</a>
        </li>
        <li>
          <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
        </li>
        <li>
          <a href="https://palmer.chat">Community Slack</a>
        </li>
      </ul>
      <ul>
        {data && data.movies && data.movies.map(movie => <li key={movie.id}>{movie.title}</li>)}
      </ul>
    </div>
  )
}

export default Home
