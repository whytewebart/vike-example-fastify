export { shared, production, development, options };

import { FastifyServerOptions } from "fastify";

// AJV PLUGINS
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";
import ajvMerge from "ajv-merge-patch";
import { ajvObjectIdPlugin } from "./plugins/ajv.extends.ts";

// AJV SCHEMAS
import Ajv from "ajv/dist/2019.js";
import draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json" with { type: "json" };

// AJV TYPES
import type * as AjvCompiler from "@fastify/ajv-compiler";

const buildValidator: AjvCompiler.BuildCompilerFromPool = function factory(
	externalSchemas,
	options,
) {
	// INSTANTIATE AJV
	const ajv = new Ajv(options?.customOptions);
	// INSTALL AJV SCHEMAS
	ajv.addMetaSchema(draft7MetaSchema);
	// INSTALL AJV PLUGINS
	options?.plugins?.forEach((plugin) => {
		if (Array.isArray(plugin)) {
			plugin[0](ajv, plugin[1]);
		} else {
			plugin(ajv);
		}
	});

	const sourceSchemas = Object.values(externalSchemas);
	for (const extSchema of sourceSchemas) {
		ajv.addSchema(extSchema);
	}

	return function validatorCompiler({ schema }: any) {
		if (schema.$id) {
			const stored = ajv.getSchema(schema.$id);
			if (stored) {
				return stored;
			}
		}
		return ajv.compile(schema);
	};
};

const shared: FastifyServerOptions = {
	ajv: {
		customOptions: {
			allErrors: true,
			useDefaults: true,
			messages: true,
			$data: true,
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
			[ajvObjectIdPlugin, {}],
		],
	},

	schemaController: {
		compilersFactory: {
			buildValidator,
		},
	},
};
const production: FastifyServerOptions = {
	...shared,
	logger: true,
};
const development: FastifyServerOptions = {
	...shared,
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
			},
		},
	},
};

const options =
	process.env.NODE_ENV === "production" ? production : development;
