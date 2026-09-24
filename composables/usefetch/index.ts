import { ref, unref, watch, onServerPrefetch, onMounted, type Ref } from 'vue'
import type { FetchOptions } from 'ofetch'
import { $api } from './fetch'

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

function resolve<T>(value: MaybeRefOrGetter<T>): T {
  return typeof value === 'function' ? (value as () => T)() : unref(value)
}

export interface UseFetchOptions<T> extends Omit<FetchOptions, 'signal'> {
  /** Fetch immediately (default: true). Set false to trigger manually via execute(). */
  immediate?: boolean
  /** Run this fetch during SSR (default: true). Set false for client-only data. */
  server?: boolean
  /** Reshape the raw response before storing it in `data`. */
  transform?: (input: any) => T
  /** Reactive sources that trigger a refetch when they change. */
  watch?: any[]
  /** Factory for the initial value of `data`, before the first response arrives. */
  default?: () => T
  /**
   * Cache key used for SSR -> client hydration and same-render dedup.
   * Defaults to the resolved URL. Pass an explicit key if the same URL is
   * called with different params/body, or collisions will hand back the
   * wrong cached value.
   */
  key?: string
}

export function useFetch<T = unknown>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions<T> = {},
) {
  const {
    immediate = true,
    server = true,
    transform,
    watch: watchSources = [],
    default: getDefault,
    key,
    ...fetchOptions
  } = options

  const data = ref<T | null>(getDefault ? getDefault() : null) as Ref<T | null>
  const error = ref<unknown>(null)
  const pending = ref(false)

  const pageContext = usePageContext()

  let controller: AbortController | undefined
  // Only ever true after this instance's first execute() call, so a manual
  // refresh() or a watch-triggered refetch always bypasses the cache and
  // hits the network for genuinely fresh data.
  let hydrationCacheChecked = false

  async function execute() {
    controller?.abort()
    const thisController = new AbortController()
    controller = thisController

    const cacheKey = key! ?? resolve(url)
    // pageContext._fetchCache is added to `passToClient` in +config.ts, so
    // Vike serializes and hydrates it exactly like it does pageContext.data.
    const cache = ((pageContext as any)._fetchCache ??= {})

    // Server: reuse a value another component already fetched this render.
    // Client: reuse the value Vike just hydrated down, but only once.
    const canUseCache = import.meta.env.SSR || !hydrationCacheChecked
    hydrationCacheChecked = true
    if (canUseCache && cacheKey in cache) {
      data.value = transform ? transform(cache[cacheKey]) : cache[cacheKey]
      return
    }

    pending.value = true
    error.value = null

    try {
      const forwardedHeaders: Record<string, string> = {}
      if (import.meta.env.SSR) {
        const cookie = (pageContext as any).headersOriginal?.cookie
        if (cookie) {
          forwardedHeaders.cookie = Array.isArray(cookie) ? cookie.join('; ') : cookie
        }

        // Server-only secret from pageContext — swap in your actual field name.
        // It must NOT be added to passToClient, so it never reaches the client.
        const secret = (pageContext as any).apiSecret
        if (secret) forwardedHeaders.authorization = `Bearer ${secret}`
      }

      const result = await $api(resolve(url), {
        ...fetchOptions,
        headers: { ...forwardedHeaders, ...fetchOptions.headers },
        signal: thisController.signal,
      })

      if (thisController.signal.aborted) return // a newer call already superseded this one
      if (import.meta.env.SSR) {
        // Store the raw result — each consumer applies its own `transform`.
        cache[cacheKey] = result
      }
      data.value = transform ? transform(result) : (result as T)
    } catch (e) {
      if (thisController.signal.aborted) return
      error.value = e
    } finally {
      if (!thisController.signal.aborted) pending.value = false
    }
  }

  if (immediate) {
    if (import.meta.env.SSR) {
      if (server) onServerPrefetch(execute)
    } else {
      onMounted(execute)
    }
  }

  if (watchSources.length) {
    watch(watchSources, execute)
  }

  return { data, error, pending, execute, refresh: execute }
}
