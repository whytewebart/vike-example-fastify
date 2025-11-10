import fastifyPlugin from 'fastify-plugin';
import type { FastifyEnvOptions } from '@fastify/env';
import { join } from 'path';
import { root } from '../root.ts';

export default fastifyPlugin(
    async (fastify, opts): Promise<void> => {

        const schema: FastifyEnvOptions['schema'] = {
            type: 'object',
            required: ['FASTIFY_STATUS'],
            properties: {
                FASTIFY_STATUS: {
                    type: 'string'
                },

                DB_FILE_NAME: {
                    type: 'string',
                    default: join(root, './local/drizzle.sqlite')
                },

                DRIZZLE_SEED: {
                    type: 'boolean',
                    default: false
                }
            }
        };

        const options: FastifyEnvOptions = {
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
            DB_FILE_NAME: string,
            DRIZZLE_SEED: boolean
        }
    }
}