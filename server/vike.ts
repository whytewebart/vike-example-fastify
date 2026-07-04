import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import rawBody from "fastify-raw-body";

import autoLoad from "@fastify/autoload";
import { join } from "path";
import { __dirname, prod } from "./root.ts";

// ajv
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import ajvMerge from "ajv-merge-patch";

const shared: FastifyServerOptions = {
	ajv: {
		customOptions: {
			allErrors: true,
			useDefaults: true,
			messages: true,
		},

		plugins: [
			[
				ajvErrors.default,
				{
					keepErrors: true,
					singleError: false,
				},
			],
			[addFormats.default, {}],
			[ajvMerge, {}],
		],
	},
};

const production = Object.assign(shared, { logger: true });
const development = Object.assign(shared, {
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
	forceCloseConnections: true, // ⚠️ Mandatory for HMR support
});

export const instance = () => {
	return fastify(prod ? production : development);
};

export const build = async (i: FastifyInstance) => {
	const __directory = prod ? join(__dirname, "../build") : __dirname;

	// LOAD PLUGINS
	await i.register(rawBody);
	// AUTLOAD PLUGINS AND ROUTES
	i.register(autoLoad, { dir: join(__directory, "plugins") });
	i.register(autoLoad, { dir: join(__directory, "routes") });
	i.register(autoLoad, {
		dir: join(__directory, "schemas"),
		indexPattern: /^loader.ts$/i,
	});

	return i;
};

async function startServer() {
	if (process.env.VERCEL) {
		console.log(
			"Running in Vercel environment, skipping standalone server start.",
		);
		return;
	}

	const i = await build(await instance());
	return i;
}

// export default await startServer();
