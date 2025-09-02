import { _GettersTree, DefineStoreOptions, StateTree, Store } from "pinia"
import { PageContext } from "vike/types"

declare global {

    interface LocalPersistOptions {
        storage?: 'localStorage' | 'sessionStorage'
        /**
         * Key to use for storage (default: store id)
         */
        key?: string
        /**
         * Array of state paths to persist (if empty, persists entire state)
         */
        paths?: string[]
    }

    interface PersistOptions {
        /**
         * Storage type: 'localStorage', 'sessionStorage', or 'cookies'
         */
        storage?: 'localStorage' | 'sessionStorage' | 'cookies'
        /**
         * Key to use for storage (default: store id)
         */
        key?: string
        /**
         * Array of state paths to persist (if empty, persists entire state)
         */
        paths?: string[]
        cookieOptions?: {
            expires?: number | Date
            path?: string
            domain?: string
            secure?: boolean
            sameSite?: 'strict' | 'lax' | 'none'
        }
    }
    
    // Extended options interface
    interface DefineStoreSSROptions<
        Id extends string,
        S extends StateTree,
        G extends _GettersTree<S>,
        A
    > extends Omit<DefineStoreOptions<Id, S, G, A>, "persist"> {
        persist?: PersistOptions | PersistOptions[],

        ssr?: {
            // SSR-specific hooks
            beforeHydrate?: (context: PageContext, store: Store<Id, S, G, A>) => void
            afterHydrate?: (context: PageContext, store: Store<Id, S, G, A>) => void
            // Custom serialization/deserialization
            serialize?: (state: S) => any
            deserialize?: (data: any) => S
        }
    }
}


declare module 'pinia' {
    export interface DefineStoreOptionsBase<S, Store> {
        /**
         * Persistence configuration for the store
         */
        persist?: LocalPersistOptions | LocalPersistOptions[],
        hello?: 'hi' | "world"
    }
}
