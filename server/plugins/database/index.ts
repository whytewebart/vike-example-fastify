import fastifyPlugin from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/libsql';
import seed from './tests/seed.ts';

export default fastifyPlugin(
    async (fastify, opts): Promise<void> => {
        const db = drizzle({
            connection: {
                url: fastify.config.DB_FILE_NAME
            }
        });

        fastify.decorate('db', db);

        if (fastify.config.DRIZZLE_SEED)
            await seed.execute(fastify, opts);

        fastify.ready(err => {
            if (err) throw new Error(err.message);
            fastify.log.info(`DB initialized`)
        })
    },
    {
        name: 'database', dependencies: [
            "validators", "fastify-env"
        ]
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        db: ReturnType<typeof drizzle>;
    }
}