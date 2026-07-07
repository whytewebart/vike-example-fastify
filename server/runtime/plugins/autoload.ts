import fp from "fastify-plugin";
import type {
	FastifyPluginAsync,
	FastifyInstance,
	FastifyPluginOptions,
} from "fastify";

export interface AutoloadModule {
	default?: any;
	autoload?: boolean;
	prefixOverride?: string;
	options?: FastifyPluginOptions;
}

export interface FastifyGlobAutoloadOptions {
	list: Record<string, () => Promise<any>> | Record<string, any>;
	base?: string;
	dirNameRoutePrefix?:
		boolean | ((parent: string, current: string) => string | boolean);
	pluginOptions?: FastifyPluginOptions;
}

interface GlobFile {
	originalKey: string;
	filename: string;
	importValue: (() => Promise<any>) | any;
}

interface GlobNode {
	segment: string;
	files: GlobFile[];
	children: Map<string, GlobNode>;
}

const fastifyGlobAutoload: FastifyPluginAsync<
	FastifyGlobAutoloadOptions
> = async (
	fastify: FastifyInstance,
	opts: FastifyGlobAutoloadOptions,
): Promise<void> => {
	const {
		list,
		base = "./routes",
		dirNameRoutePrefix = true,
		pluginOptions = {},
	} = opts;

	if (!list || typeof list !== "object") {
		throw new Error(
			'fastify-glob-autoload: The "list" option containing an import.meta.glob object is required.',
		);
	}

	const normalizedBase = base.replace(/^\.\//, "").replace(/\/$/, "");
	const tree: GlobNode = { segment: "", files: [], children: new Map() };

	for (const key of Object.keys(list)) {
		const cleanKey = key.replace(/^\.\//, "");
		let relativePath = cleanKey;
		if (normalizedBase && cleanKey.startsWith(normalizedBase)) {
			relativePath = cleanKey
				.slice(normalizedBase.length)
				.replace(/^\//, "");
		}

		const segments = relativePath.split("/");
		const filename = segments.pop();
		if (!filename) continue;

		let currentNode = tree;
		for (const segment of segments) {
			if (!currentNode.children.has(segment)) {
				currentNode.children.set(segment, {
					segment,
					files: [],
					children: new Map(),
				});
			}
			currentNode = currentNode.children.get(segment)!;
		}
		currentNode.files.push({
			originalKey: key,
			filename,
			importValue: list[key],
		});
	}

	async function registerNode(
		currentFastify: FastifyInstance,
		node: GlobNode,
	): Promise<void> {
		const hookFiles: GlobFile[] = [];
		const routeFiles: GlobFile[] = [];

		for (const file of node.files) {
			const lowerName = file.filename.toLowerCase();
			if (
				lowerName.startsWith("autohooks.") ||
				lowerName.startsWith("_hooks.")
			) {
				hookFiles.push(file);
			} else {
				routeFiles.push(file);
			}
		}

		// 1. Resolve context-level lifecycle hooks concurrently
		const loadedHooks = await Promise.all(
			hookFiles.map(async (hookFile) => {
				const moduleContent: any =
					typeof hookFile.importValue === "function"
						? await hookFile.importValue()
						: hookFile.importValue;

				let plugin = moduleContent.default ?? moduleContent;
				if (
					typeof plugin !== "function" &&
					typeof moduleContent === "function"
				) {
					plugin = moduleContent;
				}
				return { moduleContent, plugin };
			}),
		);

		for (const { moduleContent, plugin } of loadedHooks) {
			if (
				typeof plugin === "function" &&
				moduleContent.autoload !== false &&
				plugin.autoload !== false
			) {
				currentFastify.register(plugin);
			}
		}

		// 2. Resolve all directory plugins concurrently
		const metaSymbol = Symbol.for("plugin-meta");

		const resolvedRouteModules = await Promise.all(
			routeFiles.map(async (file) => {
				const moduleContent: any =
					typeof file.importValue === "function"
						? await file.importValue()
						: file.importValue;
				return { file, moduleContent };
			}),
		);

		const loadedRoutes = [];

		for (const { file, moduleContent } of resolvedRouteModules) {
			// Robustly extract the executable plugin function (handles default, CJS interop, and direct exports)
			let plugin = moduleContent.default;
			if (!plugin && typeof moduleContent === "function") {
				plugin = moduleContent;
			}

			// If no default export exists, check if there is exactly one named function export we can fallback to
			if (
				typeof plugin !== "function" &&
				moduleContent &&
				typeof moduleContent === "object"
			) {
				const functionKeys = Object.keys(moduleContent).filter(
					(k) => typeof moduleContent[k] === "function",
				);
				if (functionKeys.length === 1) {
					plugin = moduleContent[functionKeys[0]];
				}
			}

			// CRITICAL GUARD: If it isn't a function, it's a helper/schema/config file. Skip it!
			if (typeof plugin !== "function") {
				continue;
			}

			const pluginMeta = plugin?.[metaSymbol] || plugin?.meta || {};
			const explicitName = pluginMeta.name || plugin?.name;
			const filenameName = file.filename.split(".")[0];
			const dependencies: string[] =
				pluginMeta.dependencies || plugin?.dependencies || [];

			loadedRoutes.push({
				file,
				moduleContent,
				plugin,
				explicitName,
				filenameName,
				dependencies,
			});
		}

		// Map out every valid plugin identifier local to this specific folder layer
		const localPluginNames = new Set<string>();
		for (const route of loadedRoutes) {
			if (route.explicitName) localPluginNames.add(route.explicitName);
			if (route.filenameName) localPluginNames.add(route.filenameName);
		}

		// Perform topological sort based on structural dependency hierarchy
		const sortedRoutes: typeof loadedRoutes = [];
		const unsortedRoutes = [...loadedRoutes];
		const resolvedNames = new Set<string>();

		let changed = true;
		while (changed && unsortedRoutes.length > 0) {
			changed = false;
			for (let i = 0; i < unsortedRoutes.length; i++) {
				const route = unsortedRoutes[i];
				const localDeps = route.dependencies.filter((dep) =>
					localPluginNames.has(dep),
				);
				const allLocalDepsSatisfied = localDeps.every((dep) =>
					resolvedNames.has(dep),
				);

				if (allLocalDepsSatisfied) {
					sortedRoutes.push(route);
					if (route.explicitName)
						resolvedNames.add(route.explicitName);
					if (route.filenameName)
						resolvedNames.add(route.filenameName);
					unsortedRoutes.splice(i, 1);
					i--;
					changed = true;
				}
			}
		}

		if (unsortedRoutes.length > 0) {
			sortedRoutes.push(...unsortedRoutes);
		}

		// Register safe plugins sequentially
		for (const { moduleContent, plugin } of sortedRoutes) {
			if (moduleContent.autoload === false || plugin.autoload === false) {
				continue;
			}

			const customOptions = moduleContent.options || plugin.options || {};
			const prefixOverride =
				moduleContent.prefixOverride ?? plugin.prefixOverride;
			const registrationOptions = { ...pluginOptions, ...customOptions };

			if (prefixOverride !== undefined) {
				registrationOptions.prefix = prefixOverride;
			}

			currentFastify.register(plugin, registrationOptions);
		}

		// 3. Recurse down into child subdirectories
		for (const [segment, childNode] of node.children.entries()) {
			let prefix: string | undefined = undefined;

			if (dirNameRoutePrefix === true) {
				prefix = `/${segment}`;
			} else if (typeof dirNameRoutePrefix === "function") {
				const calculatedPrefix = dirNameRoutePrefix(
					node.segment,
					segment,
				);
				if (calculatedPrefix !== false) {
					prefix =
						typeof calculatedPrefix === "string" &&
						calculatedPrefix.startsWith("/")
							? calculatedPrefix
							: `/${calculatedPrefix}`;
				}
			}

			const registerOpts: FastifyPluginOptions = {};
			if (prefix) {
				registerOpts.prefix = prefix;
			}

			await currentFastify.register(async (scopedFastify) => {
				await registerNode(scopedFastify, childNode);
			}, registerOpts);
		}
	}

	await registerNode(fastify, tree);
};

export default fp(fastifyGlobAutoload, {
	fastify: ">=5.x",
	name: "fastify-glob-autoload",
});
