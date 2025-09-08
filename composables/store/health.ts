export {
    useHealth
}

import { createStore } from '~plugins/pinia/persist';
import { ofetch } from "ofetch"
import { PageContext } from 'vike/types';

const useHealth = createStore('health-api', () => {
    // types.d
    type Status = 'healthy' | 'unhealthy' | 'checking' | 'unknown';
    // State
    const status = ref<Status>('unknown')
    const lastChecked = ref<Date | null>(null)
    const error = ref<string | null>(null)
    const intervalId = ref<ReturnType<typeof setInterval> | null>(null)
    // state.metadata
    const metadata = ref<Record<string, any>>({})
    const baseURL = ref<string | null>(null)

    // Getters
    const isHealthy = computed(() => status.value === 'healthy')
    const lastPingTime = computed(() =>
        lastChecked.value ? lastChecked.value.toLocaleTimeString() : 'Never'
    )

    const getDefaultMetadata = () => {
        // Only access browser APIs on client
        if (typeof window === 'undefined') return {}

        return {
            appVersion: '1.0.0',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
        }
    }

    async function ping(url = '/ping') {
        status.value = 'checking'
        error.value = null

        try {
            await ofetch(url, {
                baseURL: `${baseURL.value}`,
                async onResponse({ request, response, options }) {
                    status.value = 'healthy'
                    metadata.value = response._data?.meta
                    // Log response
                    console.log(
                        "[fetch response]",
                        request,
                        response.status,
                        response.body
                    );
                },

                async onResponseError({ request, response, options, ...rest }) {
                    status.value = 'unhealthy'
                    error.value = rest.error?.message || 'Unknown error'
                    // Log error
                    console.log(
                        "[fetch response error]",
                        request,
                        response.status,
                        response.body
                    );
                },
            })

            metadata.value = {
                ...getDefaultMetadata(),
                ...metadata.value
            }
        } catch (err: any) {
            status.value = 'unhealthy'
            error.value = err.message || 'Fetch failed'
        } finally {
            lastChecked.value = new Date()
        }
    }

    async function startAutoPing(intervalMs = 60000, url = '/ping') {
        // Only run auto-ping on the client
        if (typeof window === 'undefined' || intervalId.value) return
        await ping(url)
        intervalId.value = setInterval(() => ping(url), intervalMs)
    }

    function stopAutoPing() {
        if (intervalId.value) {
            clearInterval(intervalId.value)
            intervalId.value = null
        }
    }

    return {
        // state
        status,
        lastChecked,
        error,
        metadata,
        intervalId,
        baseURL,

        // computed
        isHealthy,
        lastPingTime,

        // actions
        ping,
        startAutoPing,
        stopAutoPing,
    }
}, {
    persist: {
        storage: 'cookies',
        paths: [ 'status', 'lastChecked', 'metadata' ]
    },

    ssr: {

        beforeHydrate: (context, store) => {
            store.$state.baseURL = context?.urlParsed?.origin ?? `${window.location.protocol}//${window.location.origin}`
        },

        afterHydrate: (context, store) => {
            // store.$state.pageContext = context
            store.$state.lastChecked = store.$state.lastChecked ? new Date(store.$state.lastChecked) : null
        }
    }
})