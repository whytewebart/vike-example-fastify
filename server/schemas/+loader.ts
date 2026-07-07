import fp from "fastify-plugin";
// IMPORT SCHEMAS
import imports from "../utils/imports.ts";
import { join } from "path";
import { _dirname } from "../shared/dirname.ts";

export default fp<FastifyTypeBox>(
	async function (fastify, opts) {
		const modules = await imports.loadModules(
			join(_dirname, "./schemas"),
			/^\+loader\.(ts|js)$|\.md$|\.map$/i,
		);
		const schemas = Object.values(modules).flatMap((mod) =>
			Object.entries(mod).map(([_, val]) => val),
		);
		// Register all schemas with Fastify
		schemas.forEach((schema) => fastify.addSchema(schema));

		fastify.ready((err) => {
			if (err) throw new Error(err.message);
			fastify.log.info(`Schemas initialized`);
		});
	},
	{
		name: "schemas",
		dependencies: ["validators"],
	},
);
