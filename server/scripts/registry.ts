import fs from "fs/promises";
import path from "path";

const CONFIG: Record<
	string,
	{ suffix: string; label: string; registry: string }
> = {
	services: {
		suffix: "service",
		label: "Services",
		registry: "ServiceRegistry",
	},
	builders: {
		suffix: "builder",
		label: "Builders",
		registry: "BuilderRegistry",
	},
	events: {
		suffix: "listener",
		label: "Events",
		registry: "ListenerRegistry",
	},
	notifications: {
		suffix: "notif",
		label: "Notifications",
		registry: "NotifRegistry",
	},
	jobs: { suffix: "job", label: "Jobs", registry: "JobRegistry" },
};

const toPascalCase = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

function updateRegistrations(
	content: string,
	type: string,
	name: string,
	suffix: string,
	action: "create" | "remove",
) {
	const target = `fastify.decorate("${type}", {`;

	const registration = `${name}: fastify.getDecorator("${name}_${suffix}") as any,`;

	if (!content.includes(target)) return content;

	const start = content.indexOf(target) + target.length;
	const end = content.indexOf("});", start);

	let block = content.slice(start, end);

	const lines = block
		.split("\n")
		.map((l) => l.trimEnd())
		.filter(Boolean);

	if (action === "create") {
		if (!lines.some((l) => l.includes(`${name}:`))) {
			lines.unshift(`\t\t\t${registration}`);
		}
	} else {
		const filtered = lines.filter((l) => !l.includes(`${name}:`));
		lines.length = 0;
		lines.push(...filtered);
	}

	return (
		content.slice(0, start) +
		"\n" +
		lines.join("\n") +
		"\n\t\t" +
		content.slice(end)
	);
}

function updateDependencies(
	content: string,
	pluginName: string,
	action: "create" | "remove",
) {
	const regex = /dependencies:\s*\[([\s\S]*?)\]/;

	return content.replace(regex, (_, deps) => {
		let list = deps
			.split(",")
			.map((d: string) => d.trim())
			.filter(Boolean)
			.map((d: string) => d.replace(/^['"]|['"]$/g, ""));

		if (action === "create") {
			if (!list.includes(pluginName)) {
				list.push(pluginName);
			}
		} else {
			list = list.filter((d) => d !== pluginName);
		}

		list.sort();

		const formatted =
			list.length === 0
				? ""
				: "\n\t\t\t" +
					list.map((d) => `"${d}"`).join(",\n\t\t\t") +
					"\n\t\t";

		return `dependencies: [${formatted}]`;
	});
}

async function handleCreate(
	type: string,
	name: string,
	targetDir: string,
	loaderPath: string,
	filePath: string,
) {
	const { suffix, label, registry } = CONFIG[type];
	const pascalName = toPascalCase(name);
	const pascalSuffix = toPascalCase(suffix);
	const pluginName = `${pascalName}${pascalSuffix}`;

	await fs.mkdir(targetDir, { recursive: true });

	const registrationLine = `${name}: fastify.getDecorator("${name}_${suffix}") as any,`;

	// 1. Create or Update +loader.ts
	try {
		await fs.access(loaderPath);

		// File exists, let's read and append the new decorator registration
		let loaderContent = await fs.readFile(loaderPath, "utf-8");

		loaderContent = updateRegistrations(
			loaderContent,
			type,
			name,
			suffix,
			"create",
		);

		loaderContent = updateDependencies(loaderContent, pluginName, "create");

		await fs.writeFile(loaderPath, loaderContent, "utf-8");

		console.log(
			`📝 Automatically registered "${name}" inside server/${type}/+loader.ts`,
		);
	} catch {
		// File doesn't exist, create it brand new
		const loaderTemplate = `import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
\tasync (fastify, opts): Promise<void> => {
\t\t// INITIALIZE ${label.toUpperCase()} DECORATOR
\t\tfastify.decorate("${type}", {
\t\t\t${registrationLine}
\t\t});

\t\tfastify.ready((err) => {
\t\t\tif (err) throw new Error(err.message);
\t\t\tfastify.log.info("${label} initialized");
\t\t});
\t},
\t{
\t\tname: "${label}",
\t\tdependencies: ["${pluginName}"],
\t},
);

declare module "fastify" {
\texport interface FastifyInstance {
\t\t${type}: ${registry};
\t}
}
`;
		await fs.writeFile(loaderPath, loaderTemplate, "utf-8");
		console.log(`✅ Created Loader: server/${type}/+loader.ts`);
	}

	// 2. Create the suffix registry file
	try {
		await fs.access(filePath);
		console.error(
			`🚨 File already exists: server/${type}/${name}.${suffix}.ts`,
		);
	} catch {
		const fileTemplate = `import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
\tasync (fastify, opts): Promise<void> => {
\t\tconst handler: ${registry}["${name}"] = async (context) => {
\t\t\t// TODO: Implement business logic
\t\t\treturn [] as any;
\t\t};

\t\tfastify.decorate("${name}_${suffix}", handler);
\t},
\t{
\t\tname: "${pascalName}${pascalSuffix}",
\t},
);

declare global {
\tinterface ${registry} {
\t\t${name}: (
\t\t\tcontext: any,
\t\t) => Promise<any>;
\t}
}

declare module "fastify" {
\texport interface FastifyInstance {}
}
`;
		await fs.writeFile(filePath, fileTemplate, "utf-8");
		console.log(
			`✅ Created Suffix File: server/${type}/${name}.${suffix}.ts`,
		);
	}
}

async function handleRemove(
	type: string,
	name: string,
	targetDir: string,
	loaderPath: string,
	filePath: string,
) {
	const { suffix } = CONFIG[type];
	const pluginName = `${toPascalCase(name)}${toPascalCase(suffix)}`;

	// 1. Remove the specific suffix file
	try {
		await fs.unlink(filePath);
		console.log(`🗑️  Deleted File: server/${type}/${name}.${suffix}.ts`);
	} catch {
		console.log(
			`ℹ️  File server/${type}/${name}.${suffix}.ts did not exist.`,
		);
	}

	// 2. Clean up +loader.ts reference
	try {
		let loaderContent = await fs.readFile(loaderPath, "utf-8");

		// Remove decorator line
		loaderContent = loaderContent
			.split("\n")
			.filter((line) => !line.trim().startsWith(`${name}:`))
			.join("\n");

		// Remove from dependencies
		const depMatch = loaderContent.match(/dependencies: \[(.*?)\],/s);
		if (depMatch) {
			let deps = depMatch[1]
				.split(",")
				.map((d) => d.trim().replace(/['"]/g, ""));
			deps = deps.filter((d) => d !== pluginName);
			const newDeps =
				deps.length > 0 ? deps.map((d) => `"${d}"`).join(", ") : "";
			loaderContent = loaderContent.replace(
				depMatch[0],
				`dependencies: [${newDeps}],`,
			);
		}

		await fs.writeFile(loaderPath, loaderContent, "utf-8");
		console.log(`扫 Cleaned up reference inside server/${type}/+loader.ts`);
	} catch {
		// Loader doesn't exist, nothing to clean
	}

	// 3. Prune empty directory
	try {
		const remainingFiles = await fs.readdir(targetDir);
		const hasOtherRegistries = remainingFiles.some((file) =>
			file.endsWith(`.${suffix}.ts`),
		);

		if (!hasOtherRegistries) {
			for (const file of remainingFiles) {
				await fs.unlink(path.join(targetDir, file));
			}
			await fs.rmdir(targetDir);
			console.log(
				`🧼 Entire directory server/${type}/ was empty, pruned successfully.`,
			);
		}
	} catch (err) {
		// Directory already removed
	}
}

async function main() {
	const [, , action, type, name] = process.argv;

	if (!action || !["create", "remove"].includes(action)) {
		console.error(`❌ Action must be "create" or "remove".`);
		process.exit(1);
	}

	if (!type || !CONFIG[type]) {
		console.error(
			`❌ Please specify a valid folder type: ${Object.keys(CONFIG).join(", ")}`,
		);
		process.exit(1);
	}

	if (!name) {
		console.error(`❌ Please specify a resource name.`);
		process.exit(1);
	}

	const targetDir = path.join(process.cwd(), "server", type);
	const loaderPath = path.join(targetDir, "+loader.ts");
	const filePath = path.join(targetDir, `${name}.${CONFIG[type].suffix}.ts`);

	if (action === "create") {
		await handleCreate(type, name, targetDir, loaderPath, filePath);
	} else {
		await handleRemove(type, name, targetDir, loaderPath, filePath);
	}
}

main().catch(console.error);
