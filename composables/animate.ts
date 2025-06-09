import { onMounted } from 'vue';

// DECLARE TYPES
interface GsapContext {
    gsap: GSAP;
    elementKey: <T extends string>(key: T) => `[data-animate="${T}"]`;
    defineKeys: <const Keys extends readonly string[]>(keys: Keys) => SelectorMap<Keys>,
    plugins: Array<keyof typeof pluginLoaders>
}
// END TYPES DECLARATIONS

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
    return `[data-animate="${key_}"]` as const;
};

const state = {
    instance: null as GSAP | null,
    plugins: {} as Record<string, { name: string;[key: string]: any }>,
    loadingPromise: null as Promise<void> | null,
};

const pluginLoaders = {
    ScrollTrigger: () => import('gsap/ScrollTrigger').then(mod => mod.default),
    MorphSVGPlugin: () => import('gsap/MorphSVGPlugin').then(mod => mod.default),
    ScrollSmoother: () => import('gsap/ScrollSmoother').then(mod => mod.default),
    SplitText: () => import('gsap/SplitText').then(mod => mod.default),
    ScrollToPlugin: () => import('gsap/ScrollToPlugin').then(mod => mod.default)
};

export const useGsap = (
    callback: (context: GsapContext) => void,
    options?: { plugins?: Array<keyof typeof pluginLoaders>; }
) => {
    const isVue = !!getCurrentInstance()
    const { plugins = [] } = options || {};
    // HELPER FUNCTIONS
    /** DEFINE MULTIPLE KEYS */ // @ts-ignore
    const defineKeys = <const Keys extends readonly string[]>(keys: Keys): SelectorMap<Keys> => Object.fromEntries(keys.map(key => [key, elementKey(key)]))

    const lifecycle = async () => {
        try {
            if (!state.instance) {
                state.loadingPromise ??=
                    import('gsap').then(({ gsap }) => { state.instance = gsap });
                await state.loadingPromise;
            }

            // Check and register any new plugins
            for (const name of plugins) {
                if (!state.plugins[name]) {
                    const plugin = await pluginLoaders[name]();
                    state.plugins[name] = plugin;
                    state.instance!.registerPlugin(plugin);
                }
            }

            if (state.instance) {
                callback({
                    gsap: state.instance,
                    elementKey,
                    plugins: state.plugins as any,
                    defineKeys
                });
            }
        } catch (error) {
            console.error('❌ GSAP setup failed:', error);
        }
    }

    if (!isVue) {
        return lifecycle()
    }

    // HELPER FUNCTIONS END
    onMounted(lifecycle);
};