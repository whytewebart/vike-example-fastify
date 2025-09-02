// https://vike.dev/data
export { data }
export type Data = Omit<Awaited<ReturnType<typeof data>>, "unhead">

import { ofetch } from "ofetch"
import type { MovieDetails } from '../types'
import type { PageContextServer } from 'vike/types'

const data = async (pageContext: PageContextServer) => {
  await sleep(300) // Simulate slow network

  const response = await ofetch<MovieDetails[]>(`http://localhost:3040/movies.json`)
  let movie = response.find((d, index) => (index + 1).toString() === pageContext.routeParams!.id) as MovieDetails;

  movie = minimize(movie)

  // Test pinia on server hooks
  const { ping } = useHealth(pageContext);
  await ping()

  return {
    movie,
    // The page's seo data
    unhead: {
      title: movie.title,
      meta: [
        {
          name: "description",
          content: `Star Wars: ${movie.title}`
        }
      ]
    } as UnheadInput
  }
}

function minimize(movie: MovieDetails & Record<string, unknown>): MovieDetails {
  const { id, title, release_date, director, producer } = movie
  movie = { id, title, release_date, director, producer }
  return movie
}

function sleep(milliseconds: number) {
  return new Promise((r) => setTimeout(r, milliseconds))
}
