import { ofetch } from 'ofetch'

/**
 * Isomorphic $api instance.
 *
 * - Client: relative baseURL ('/api') — the browser resolves it against
 *   window.location.origin.
 * - Server: needs an absolute URL, since there's no window/origin during SSR.
 *   Because Fastify serves both the API routes and the Vike SSR middleware
 *   in the same process, this just loops back to itself over localhost.
 *
 * IMPORTANT: don't put per-request data here (cookies, auth headers, etc).
 * This instance is a module-level singleton shared by every concurrent SSR
 * request your Fastify server handles. Per-request headers are added inside
 * useFetch.ts instead, right before each call.
 */
const baseURL = import.meta.env.SSR
  ? (process.env.API_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api`)
  : '/api'

export const $api = ofetch.create({
  baseURL,
  onResponseError({ response }) {
    // Centralized place to log/report API errors if you want.
    // Avoid throwing here — let callers read `error` from useFetch instead.
    console.error(`[$api] ${response.status} ${response.url}`)
  },
})
