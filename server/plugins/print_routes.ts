// import * as chalk from 'chalk';
import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */

export default fp<FastifyPluginAsync>(async function (fastify, opts) {
    fastify.decorate('routes', new Map());
    fastify.addHook('onRoute', (routeOptions) => {
        const { url } = routeOptions

        let routeListForUrl = fastify.routes.get(url)
        if (!routeListForUrl) {
            routeListForUrl = []; fastify.routes.set(url, routeListForUrl)
        }

        routeListForUrl.push(routeOptions)
    })

    fastify.get('/__routes__', (request, reply) => {
        const routes = Object.fromEntries(fastify.routes);
        reply.code(200).send(routes)
    })

    fastify.ready(err => {
        if (err) throw new Error(err.message)
        fastify.log.info(`Routes initialized`)
    })
}, {
    name: 'print-routes', dependencies: [
        "validators"
    ]
});

declare module 'fastify' {
    export interface FastifyInstance {
        routes: Map<string, any>
    }
}