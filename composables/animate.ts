/**

import { breakpointsTailwind } from "@vueuse/core";
import {
	getCurrentInstance,
	onMounted,
	toValue,
	type MaybeRefOrGetter,
} from "vue";


const createBreakpoints = () => useBreakpoints(breakpointsTailwind);

// DECLARE TYPES
type PluginLoaders = typeof pluginLoaders;

type GsapPlugins = {
	[K in keyof PluginLoaders]?: Awaited<ReturnType<PluginLoaders[K]>>;
};

type GsapBreakpoints = ReturnType<typeof createBreakpoints>;


interface GsapContext {
	gsap: GSAP;
	elementKey: <T extends string>(key: T) => `[data-animate="${T}"]`;
	defineKeys: <const Keys extends readonly string[]>(
		keys: Keys,
	) => SelectorMap<Keys>;
	plugins: GsapPlugins;
	breakpoints: GsapBreakpoints;
}
// END TYPES DECLARATIONS

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
	return `[data-animate="${key_}"]` as const;
};

const state = {
	instance: null as GSAP | null,
	plugins: {} as any,
	loadingPromise: null as Promise<void> | null,
};

const pluginLoaders = {
	ScrollTrigger: () =>
		import("gsap/ScrollTrigger").then((mod) => mod.default),
	MorphSVGPlugin: () =>
		import("gsap/MorphSVGPlugin").then((mod) => mod.default),
	ScrollSmoother: () =>
		import("gsap/ScrollSmoother").then((mod) => mod.default),
	SplitText: () => import("gsap/SplitText").then((mod) => mod.default),
	ScrollToPlugin: () =>
		import("gsap/ScrollToPlugin").then((mod) => mod.default),
	ScrambleTextPlugin: () =>
		import("gsap/ScrambleTextPlugin").then((mod) => mod.default),
};

export const useGsap = (
	callback: (context: GsapContext) => void,
	options?: {
		plugins?: Array<keyof typeof pluginLoaders>;
		enabled?: MaybeRefOrGetter<boolean>;
	},
) => {
	const isVue = !!getCurrentInstance();
	const breakpoints = useBreakpoints(breakpointsTailwind);

	const { plugins = [], enabled = true } = options || {};

	// DEFINE MULTIPLE KEYS
	const defineKeys = <const Keys extends readonly string[]>(
		keys: Keys,
	): SelectorMap<Keys> =>
		Object.fromEntries(
			keys.map((key) => [key, elementKey(key)]),
		) as SelectorMap<Keys>;

	const lifecycle = async () => {
		// Check if animation is enabled
		if (!toValue(enabled)) {
			return;
		}

		try {
			if (!state.instance) {
				state.loadingPromise ??= import("gsap").then(({ gsap }) => {
					state.instance = gsap;
				});

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

			if (state.instance && toValue(enabled)) {
				callback({
					gsap: state.instance,
					elementKey,
					plugins: state.plugins,
					defineKeys,
					breakpoints,
				});
			}
		} catch (error) {
			console.error("❌ GSAP setup failed:", error);
		}
	};

	if (!isVue) {
		return lifecycle();
	}

	onMounted(lifecycle);
};
*/

import { breakpointsTailwind } from "@vueuse/core";
import {
	getCurrentInstance,
	onMounted,
	toValue,
	type MaybeRefOrGetter,
} from "vue";

const createBreakpoints = () => useBreakpoints(breakpointsTailwind);

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type PluginLoaders = typeof pluginLoaders;

type GsapPlugins = {
	[K in keyof PluginLoaders]?: Awaited<ReturnType<PluginLoaders[K]>>;
};

type GsapBreakpoints = ReturnType<typeof createBreakpoints>;

interface GsapContext {
	gsap: GSAP;
	elementKey: <T extends string>(key: T) => `[data-animate="${T}"]`;
	defineKeys: <const Keys extends readonly string[]>(
		keys: Keys,
	) => SelectorMap<Keys>;
	plugins: GsapPlugins;
	breakpoints: GsapBreakpoints;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
	return `[data-animate="${key_}"]` as const;
};

// --------------------------------------------------
// STATE
// --------------------------------------------------

const state = {
	instance: null as GSAP | null,

	plugins: {} as GsapPlugins,

	loadingPromise: null as Promise<void> | null,
};

// --------------------------------------------------
// PLUGIN LOADERS
// --------------------------------------------------

const pluginLoaders = {
	ScrollTrigger: () =>
		import("gsap/ScrollTrigger").then((mod) => mod.default),

	MorphSVGPlugin: () =>
		import("gsap/MorphSVGPlugin").then((mod) => mod.default),

	ScrollSmoother: () =>
		import("gsap/ScrollSmoother").then((mod) => mod.default),

	SplitText: () => import("gsap/SplitText").then((mod) => mod.default),

	ScrollToPlugin: () =>
		import("gsap/ScrollToPlugin").then((mod) => mod.default),

	ScrambleTextPlugin: () =>
		import("gsap/ScrambleTextPlugin").then((mod) => mod.default),
};

// --------------------------------------------------
// COMPOSABLE
// --------------------------------------------------

export const useGsap = (
	callback?: (context: GsapContext) => void,
	options?: {
		plugins?: Array<keyof typeof pluginLoaders>;
		enabled?: MaybeRefOrGetter<boolean>;
	},
) => {
	const isVue = !!getCurrentInstance();

	const breakpoints = useBreakpoints(breakpointsTailwind);

	const { plugins = [], enabled = true } = options || {};

	// --------------------------------------------------
	// DEFINE MULTIPLE KEYS
	// --------------------------------------------------

	const defineKeys = <const Keys extends readonly string[]>(
		keys: Keys,
	): SelectorMap<Keys> =>
		Object.fromEntries(
			keys.map((key) => [key, elementKey(key)]),
		) as SelectorMap<Keys>;

	// --------------------------------------------------
	// LIFECYCLE
	// --------------------------------------------------

	const lifecycle = async () => {
		// Check if animation is enabled
		if (!toValue(enabled)) {
			return;
		}

		try {
			// ----------------------------------------------
			// LOAD GSAP
			// ----------------------------------------------

			if (!state.instance) {
				state.loadingPromise ??= import("gsap").then(({ gsap }) => {
					state.instance = gsap;
				});

				await state.loadingPromise;
			}

			// ----------------------------------------------
			// LOAD PLUGINS
			// ----------------------------------------------

			for (const name of plugins) {
				if (!state.plugins[name]) {
					const plugin = await pluginLoaders[name]();

					state.plugins[name] = plugin;

					state.instance!.registerPlugin(plugin);
				}
			}

			// ----------------------------------------------
			// RUN CALLBACK
			// ----------------------------------------------

			if (state.instance && toValue(enabled)) {
				callback?.({
					gsap: state.instance,
					elementKey,
					plugins: state.plugins,
					defineKeys,
					breakpoints,
				});
			}
		} catch (error) {
			console.error("❌ GSAP setup failed:", error);

			throw error;
		}
	};

	// --------------------------------------------------
	// VUE / NON-VUE EXECUTION
	// --------------------------------------------------

	if (!isVue) {
		const promise = lifecycle();

		return {
			gsap: state.instance,
			plugins: state.plugins,
			breakpoints,
			defineKeys,
			elementKey,
			ready: promise,
		};
	}

	onMounted(lifecycle);

	// --------------------------------------------------
	// EXPOSE GSAP API
	// --------------------------------------------------

	return {
		gsap: state.instance,
		plugins: state.plugins,
		breakpoints,
		defineKeys,
		elementKey,
		ready: lifecycle,
	};
};
