import fastify, { type FastifyInstance } from "fastify";
import rawBody from "fastify-raw-body";
import { readdirSync } from "fs";
import { resolve } from "path";
import { _dirname } from "../shared/dirname.ts";
import { options } from "./options.ts";

import AUTOLOAD_REGISTRY from "./plugins/registry.ts";

export function instance(): FastifyInstance {
	return fastify(options);
}

export async function build(i: FastifyTyped): Promise<FastifyInstance> {
	// Mandatory for Vike middleware
	await i.register(rawBody);

	// 1. Standard Plugins
	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../plugins/**/*.ts", { eager: true }),
		base: "../plugins",
		pluginOptions: { logLevel: "warn" },
	});

	// 2. HTTP Routes
	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../routes/**/*.ts", { eager: true }),
		base: "../routes",
		pluginOptions: { logLevel: "warn" },
	});

	// 3. Schemas
	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../schemas/+loader.{ts,js}", { eager: true }),
		base: "../schemas",
		pluginOptions: { logLevel: "warn" },
	});

	// 4. Backend Conventions (Services, Builders, Events, Notifications, Jobs)
	// Using an array of globs captures all your convention suffixes in one pass.
	// dirNameRoutePrefix is disabled to prevent these from becoming URL endpoints.
	await i.register(import("./plugins/autoload.ts"), {
		list: AUTOLOAD_REGISTRY,
		base: "..",
		dirNameRoutePrefix: false,
		pluginOptions: { logLevel: "warn" },
	});

	// 5. Runtime Debugging Route
	// Kept fs/path operations here as this is explicitly a runtime filesystem inspector.
	i.get(
		"/vercel",
		{
			schema: {
				querystring: {
					type: "object",
					properties: {
						path: { type: "string", default: "." },
					},
				},
			},
		},
		async (req, res) => {
			const queryPath = req.query.path || ".";

			try {
				const targetDirectory = resolve(_dirname, queryPath);
				const entries = readdirSync(targetDirectory, {
					withFileTypes: true,
				});

				const contents = entries.map((entry) => ({
					name: entry.name,
					type: entry.isDirectory()
						? "directory"
						: entry.isFile()
							? "file"
							: "other",
				}));

				res.send({
					currentRelativePath: queryPath,
					absolutePath: targetDirectory,
					contents,
				});
			} catch (error: any) {
				res.status(404).send({
					error: "Directory not found or could not be read",
					message: error.message,
				});
			}
		},
	);

	return i;
}

export function terminate(app: FastifyInstance): void {
	const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];
	for (const signal of signals) {
		process.on(signal, async () => {
			await app.close();
			process.exit(0);
		});
	}
}
