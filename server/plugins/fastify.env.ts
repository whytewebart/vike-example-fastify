import fastifyPlugin from 'fastify-plugin';
import { join } from 'path';
import { root } from '../root.js';

export default fastifyPlugin(
    async (fastify, opts): Promise<void> => {

        const schema = {
            type: 'object',
            required: ['FASTIFY_STATUS'],
            properties: {
                FASTIFY_STATUS: {
                    type: 'string'
                },
            }
        }
        const options = {
            dotenv: {
                path: join(root, '.env'),
                debug: true
            },
            schema: schema,
            data: process.env
        }

        fastify.register(import("@fastify/env"), options);
        fastify.ready(err => {
            if (err) throw new Error(err.message);
            fastify.log.info(`ENV initialized`)
        })
    },
    {
        name: 'fastify-env', dependencies: [
           "validators"
        ]
    }
)

declare module 'fastify' {
    export interface FastifyInstance {
        config: {
            FASTIFY_STATUS: string,
            MONGODB_CONNECTION_STRING: string,
            MONGODB_DRIVE_STRING: string,
        }
    }
}