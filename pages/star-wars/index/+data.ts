// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { ofetch } from 'ofetch'
// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import type { MovieDetails, Movie } from '../types'
import type { PageContextServer } from 'vike/types'

const data = async (pageContext: PageContextServer) => {
  await sleep(700) // Simulate slow network
  // Fetch data from the server-side endpoint
  const response = await ofetch<MovieDetails[]>(`http://${pageContext.headers?.host}${import.meta.env.BASE_URL}/movies.json`)

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  const movies = minimize(response)

  return {
    movies,
    // The page's <title>
    unhead: {
      title: `${movies.length} Star Wars Movies`
    }
  }
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}

function sleep(milliseconds: number) {
  return new Promise((r) => setTimeout(r, milliseconds))
}
