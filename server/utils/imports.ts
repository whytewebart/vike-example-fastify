// importAllFromVite.ts

/**
 * Processes a Vite glob object, applies optional filtering, and extracts default/named exports.
 * * @param globMatches - The object returned by Vite's import.meta.glob()
 * @param ignoreRegex - Optional RegExp to skip specific files
 */
export async function loadModules(
	globMatches: Record<string, () => Promise<any>>,
	ignoreRegex: RegExp | null = null,
) {
	const modules: Record<string, any> = {};

	for (const [filePath, importModule] of Object.entries(globMatches)) {
		// Extract filename (e.g., "./dir/myModule.ts" -> "myModule.ts")
		const filename = filePath.split("/").pop() || "";

		// Skip if it matches the ignore regex
		if (ignoreRegex && ignoreRegex.test(filename)) continue;

		// Extract the base name without the extension (e.g., "myModule.ts" -> "myModule")
		const extIndex = filename.lastIndexOf(".");
		const base =
			extIndex !== -1 ? filename.substring(0, extIndex) : filename;

		// Dynamically resolve the module via Vite's lazy loader
		const mod = await importModule();

		// Support both default and named exports
		modules[base] = mod.default || mod;
	}

	return modules;
}

export default {
	loadModules,
};
