import { gql } from 'apollo-server'
import { getManager } from 'typeorm'
import * as uuid from 'uuid'
import { addWeeks } from 'date-fns'

import { connect, disconnect, query } from '../tests/utils'
import { Movie } from '../entity/Movie'
import Factories from '../tests/factories'
import { Screening } from '../entity/Screening'

beforeAll(connect)
afterAll(disconnect)

describe('movies', () => {
  const QUERY = gql`
    query movies($week: Int) {
      movies(week: $week) {
        id
        title
        screenings {
          date
        }
      }
    }
  `
  it('get a list of movies for a specific week', async () => {
    const movieId = uuid.v4()
    await getManager().save(Movie, { id: movieId, ...Factories.movie() })
    const screening = getManager().create(Screening, {
      movieId,
      date: addWeeks(new Date(), 5),
    })
    await getManager().save(screening)

    const results = await query(QUERY, { week: 5 })

    expect(results.data.movies).toHaveLength(1)
    expect(results.data.movies[0].id).toEqual(movieId)
    expect(results.data.movies[0].screenings).toHaveLength(1)
  })
})

describe('movie', () => {
  const QUERY = gql`
    query movie($id: ID!) {
      movie(id: $id) {
        title
      }
    }
  `

  it('send null if there is no movie', async () => {
    const result = await query(QUERY, {
      id: '7d3dc08b-08e7-46ae-8597-5dc121e59aa0',
    })

    expect(result.data.movie).toBeNull()
  })

  it("return an existing movie from it's ID", async () => {
    const id = uuid.v4()
    await getManager().save(Movie, {
      id,
      allocineId: 982739,
      title: 'Test movie',
      runtime: 12000,
      release: new Date(),
    })

    const result = await query(QUERY, { id })

    expect(result.data.movie.title).toEqual('Test movie')
  })
})
