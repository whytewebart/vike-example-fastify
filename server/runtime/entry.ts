import fastify, { type FastifyInstance } from "fastify";
import autoLoad from "@fastify/autoload";
import rawBody from "fastify-raw-body";
import { existsSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { _dirname } from "../shared/dirname.ts";
import { options } from "./options.ts";
import { prod } from "../shared/environment.ts";

/** Directories that follow the "++helper" / "+loader" naming convention. */
interface ConventionDirectory {
	directory: string;
	/** Suffix matched against filenames, e.g. "user.service.ts". */
	suffix: string;
}

const CONVENTION_DIRECTORIES: ConventionDirectory[] = [
	{ directory: "services", suffix: "service" },
	{ directory: "builders", suffix: "builder" },
	{ directory: "events", suffix: "listener" },
	{ directory: "notifications", suffix: "notif" },
	{ directory: "jobs", suffix: "job" },
];

const LOADER_PATTERN = /\+loader\.(ts|js)$/i;

function helperPattern(suffix: string): RegExp {
	return new RegExp(`(\\+\\+helper|\\w+\\.${suffix})\\.(ts|js)$`);
}

export function instance(): FastifyInstance {
	return fastify(options);
}

export async function build(i: FastifyTyped): Promise<FastifyInstance> {
	// directory
	const _directory = prod ? join(_dirname, "../build") : _dirname;

	// Mandatory for Vike middleware
	await i.register(rawBody);

	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../plugins/**/*.ts", { eager: true }),
		base: "../plugins",
		pluginOptions: {
			logLevel: "warn",
		},
	});

	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../routes/**/*.ts", { eager: true }),
		base: "../routes",
		pluginOptions: {
			logLevel: "warn",
		},
	});

	await i.register(import("./plugins/autoload.ts"), {
		list: import.meta.glob("../schemas/+loader.{ts,js}", { eager: true }),
		base: "../schemas",
		pluginOptions: {
			logLevel: "warn",
		},
	});

	// Autoload structure, helpers, and loaders for the "++helper" / "+loader" convention
	for (const { directory, suffix } of CONVENTION_DIRECTORIES) {
		const dir = join(_directory, directory);
		if (!existsSync(dir)) continue;

		void i.register(autoLoad, { dir, matchFilter: helperPattern(suffix) });
		void i.register(autoLoad, { dir, indexPattern: LOADER_PATTERN });
	}

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
			// 1. Grab the relative path from the query string (default to current directory)
			const queryPath = req.query.path;

			try {
				// 2. Resolve the path relative to your base _dirname
				// This natively handles '.', '..', and forward paths like 'runtime/subfolder'
				const targetDirectory = resolve(_dirname, queryPath);

				// 3. Read the directory entries
				const entries = readdirSync(targetDirectory, {
					withFileTypes: true,
				});

				// 4. Map entries to separate names and types (directory vs file)
				const contents = entries.map((entry) => ({
					name: entry.name,
					type: entry.isDirectory()
						? "directory"
						: entry.isFile()
							? "file"
							: "other",
				}));

				// 5. Send back metadata to help your client navigate further
				res.send({
					currentRelativePath: queryPath,
					absolutePath: targetDirectory,
					contents,
				});
			} catch (error) {
				// Handle cases where a directory doesn't exist or permissions are denied
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
