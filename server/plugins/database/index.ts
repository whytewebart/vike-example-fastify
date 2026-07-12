import fastifyPlugin from "fastify-plugin";
// import { drizzle } from "drizzle-orm/node-sqlite";

/**
 * DRIZZLE is commented out because of compatibility issues with Vercel serverless
 * environment, this database can be used as is within a Node.js environment.
 * You can use a remote database with the `drizzle-orm` package and current setup.
 */

export default fastifyPlugin(
	async (fastify, opts): Promise<void> => {
		// const db = drizzle(fastify.config.DB_FILE_NAME);
		// fastify.decorate("db", db);

		fastify.ready((err) => {
			if (err) throw new Error(err.message);
			fastify.log.warn('[database] not initialized');
		});
	},
	{
		name: "database",
		dependencies: ["validators", "fastify-env"],
	},
);

declare module "fastify" {
	export interface FastifyInstance {
		// db: ReturnType<typeof drizzle>;
	}
}
