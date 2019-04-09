import Axios from 'axios'
import * as qs from 'qs'

const { TMDB_API_KEY } = process.env

interface PaginatedResults<T> {
  page: number
  total_results: number
  total_pages: number
  results: T[]
}

interface Movie {
  vote_count: number
  id: number
  video: false
  vote_average: number
  title: string
  popularity: number
  poster_path: string | null
  original_language: string
  original_title: string
  genre_ids: number[]
  backdrop_path: string | null
  adult: boolean
  overview: string | null
  release_date: string
}

export const searchMovie = async (title: string, date: Date) => {
  const year = date.getFullYear()
  const data = qs.stringify({
    api_key: TMDB_API_KEY, // eslint-disable-line @typescript-eslint/camelcase
    language: 'fr-FR',
    query: title,
    year,
  })

  const response = await Axios.get<PaginatedResults<Movie>>(
    'https://api.themoviedb.org/3/search/movie?' + data
  )

  return response.data
}

interface VideoList {
  id: number
  results: {
    id: string
    iso_639_1: string
    iso_3166_1: string
    key: string
    name: string
    site: 'YouTube'
    size: 360 | 480 | 720 | 1080
    type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette'
  }[]
}

export const getTrailer = async (tmdbId: number) => {
  const data = qs.stringify({
    api_key: TMDB_API_KEY, // eslint-disable-line @typescript-eslint/camelcase
  })

  const response = await Axios.get<VideoList>(
    `https://api.themoviedb.org/3/movie/${tmdbId}/videos?${data}`
  )

  return response.data
}
