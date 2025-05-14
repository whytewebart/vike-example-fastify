import fastifyPlugin from 'fastify-plugin';
import { join } from 'path';
import { root } from '../root.js';

export default fastifyPlugin(
    async (fastify, opts): Promise<void> => {

        fastify.ready(err => {
            if (err) throw new Error(err.message);
            fastify.log.info(`CACHE initialized`)
        })
    },
    {
        name: 'cache-plugin'
    }
)

declare module 'fastify' {
    export interface FastifyInstance {

    }
}