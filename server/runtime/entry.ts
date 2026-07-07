import fastify, { type FastifyInstance } from "fastify";
import autoLoad from "@fastify/autoload";
import rawBody from "fastify-raw-body";
import { existsSync } from "fs";
import { join } from "path";
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

export async function build(i: FastifyInstance): Promise<FastifyInstance> {
	// directory
	const _directory = prod ? join(_dirname, "../build") : _dirname;

	// Mandatory for Vike middleware
	await i.register(rawBody);

	// Autoload plugins, routes, and schema loaders
	void i.register(autoLoad, { dir: join(_dirname, "plugins") });
	void i.register(autoLoad, { dir: join(_dirname, "routes") });
	void i.register(autoLoad, {
		dir: join(_dirname, "schemas"),
		indexPattern: /^\+loader\.(ts|js)$/i,
	});

	// Autoload structure, helpers, and loaders for the "++helper" / "+loader" convention
	for (const { directory, suffix } of CONVENTION_DIRECTORIES) {
		const dir = join(_dirname, directory);
		if (!existsSync(dir)) continue;

		void i.register(autoLoad, { dir, matchFilter: helperPattern(suffix) });
		void i.register(autoLoad, { dir, indexPattern: LOADER_PATTERN });
	}

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
