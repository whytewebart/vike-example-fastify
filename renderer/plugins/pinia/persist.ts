import { _GettersTree, PiniaPluginContext, StateTree, Store } from 'pinia'
import Cookies from 'js-cookie'
import * as cookie from "cookie"
import { PageContext } from 'vike/types'
import { serialize } from './utils'
import { UnwrapRef } from 'vue'


function persistence() {
    return (context: PiniaPluginContext) => {
        const { store, options } = context

        if (!options.persist) return

        const persistConfigs = Array.isArray(options.persist)
            ? options.persist
            : [options.persist]

        // Load persisted state for each configuration
        persistConfigs.forEach((config: PersistOptions) => {
            const storageKey = config.key || store.$id
            const storageType = config.storage || 'localStorage'

            // Load persisted state
            const persistedState = loadFromStorage(storageKey, storageType, config.cookieOptions)
            if (persistedState) {
                store.$patch(persistedState)
            }
        })

        // Subscribe to store changes
        store.$subscribe((mutation, state) => {

            persistConfigs.forEach((config: PersistOptions) => {
                const storageKey = config.key || store.$id
                const storageType = config.storage || 'localStorage'
                const stateToPersist = config.paths
                    ? getNestedState(state, config.paths)
                    : state

                saveToStorage(storageKey, stateToPersist, storageType, config.cookieOptions)
            })
        })
    }
}

// Setup function overload
export function createStore<
    Id extends string,
    S extends StateTree = {},
    G extends _GettersTree<S> = {},
    A = {}
>(
    id: Id,
    setup: () => S,
    options?: Omit<DefineStoreSSROptions<Id, S, G, A>, 'id' | 'state' | 'getters' | 'actions'>
) {
    // Create the original store definition
    const originalDefinition = defineStore(id, setup, options as any)
    // Enhanced server function that accepts SSR context
    const server = (context?: PageContext): Store<Id, S, G, A> => {
        const store = originalDefinition(context?.store)
        // Handle Hydration
        hydrateStore(store, context, [options?.ssr as any, options?.hydrate])
        // @ts-ignore
        return store
    }

    return server
}

function loadFromStorage(
    key: string,
    storageType: 'localStorage' | 'sessionStorage' | 'cookies',
    cookieOptions?: any
): StateTree | null {
    try {
        let data: string | null = null

        switch (storageType) {
            case 'localStorage':
                data = localStorage.getItem(key)
                break
            case 'sessionStorage':
                data = sessionStorage.getItem(key)
                break
            case 'cookies':
                data = Cookies.get(key) || null
                break
        }

        return data ? JSON.parse(data) : null
    } catch (error) {
        console.warn(`Failed to load persisted state from ${storageType}:`, error)
        return null
    }
}

function saveToStorage(
    key: string,
    data: StateTree,
    storageType: 'localStorage' | 'sessionStorage' | 'cookies',
    cookieOptions?: any
): void {
    try {
        const serializedData = JSON.stringify(data)

        switch (storageType) {
            case 'localStorage':
                localStorage.setItem(key, serializedData)
                break
            case 'sessionStorage':
                sessionStorage.setItem(key, serializedData)
                break
            case 'cookies':
                Cookies.set(key, serializedData, cookieOptions || {})
                break
        }
    } catch (error) {
        console.warn(`Failed to persist state to ${storageType}:`, error)
    }
}

function getNestedState(state: StateTree, paths: string[]): StateTree {
    const result: StateTree = {}

    paths.forEach(path => {
        const value = path.split('.').reduce((obj, key) => {
            return obj?.[key]
        }, state as any)

        if (value !== undefined) {
            // Reconstruct nested structure
            const keys = path.split('.')
            let current = result

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {}
                }
                current = current[keys[i]]
            }

            current[keys[keys.length - 1]] = value
        }
    })

    return result
}

// Helper functions
function hydrateStore
    <
        Id extends string,
        S extends StateTree,
        G extends _GettersTree<S>,
        A
    >(
        store: Store<Id, S, G, A>,
        context?: PageContext,
        options?: [ssr: (Omit<DefineStoreSSROptions<Id, S, G, A>, 'id' | 'state' | 'getters' | 'actions'>)['ssr'], hydrate?: (state: UnwrapRef<S>, initialState: UnwrapRef<any>) => void]
    ): void {
    // Call beforeHydrate hook if provided
    const [ssr, hydrate] = options!;
    var library: Record<string, any> | undefined;

    // Hydrate peristent [ cookie ] state
    if (import.meta.env.SSR && context)
        library = context.headers ? cookie.parse(context.headers.cookie || '') : {};
    // Hydrate [ passToClient - `_piniaInitialState` ]
    else if (!import.meta.env.SSR)
        library = serialize(usePageContext().value._piniaInitialState);

    ssr?.beforeHydrate?.(context ?? usePageContext().value, store)

    // Default hydrate function
    function defaultHydrate() {
        // Retrieve store's state
        let state = library?.[store.$id];
        state = state && typeof state === 'string' ? JSON.parse(state) : state;
        // Patch state
        if (state) store.$state = state;
    }

    (hydrate || defaultHydrate)
        (store.$state, context?.store?.state.value[store.$id] || {});

    ssr?.afterHydrate?.(context ?? usePageContext().value, store)
}

export default {
    plugin: persistence
}