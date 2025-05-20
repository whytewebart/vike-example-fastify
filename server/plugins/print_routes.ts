// import * as chalk from 'chalk';
import fp from 'fastify-plugin';
import fs from 'fs';
import { FastifyPluginAsync } from 'fastify';
import path from 'path';
import { root } from '../root.js';
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */

interface DirectoryItem {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    children?: DirectoryItem[];
}

interface DirectoryTreeOptions {
    showHidden?: boolean;
    maxDepth?: number;
}

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

    fastify.decorate("directoryTree",
        (
            dirPath: string,
            options: DirectoryTreeOptions = {},
            currentDepth = 0
        ) => {
            const { showHidden = false, maxDepth = Infinity } = options;
            if (!fs.existsSync(dirPath)) {
                console.error(`Path does not exist: ${dirPath}`);
                return null;
            }

            if (currentDepth > maxDepth) return null;

            try {
                const stats = fs.statSync(dirPath);
                const baseName = path.basename(dirPath);

                // If it's a file (unlikely for root, but handles recursive cases)
                if (!stats.isDirectory()) {
                    return {
                        name: baseName,
                        path: dirPath,
                        type: 'file',
                        size: stats.size
                    };
                }

                // Process directory
                const items = fs.readdirSync(dirPath)
                    .filter(item => showHidden || !item.startsWith('.'))
                    .map(item => {
                        const fullPath = path.join(dirPath, item);
                        return {
                            name: item,
                            path: fullPath,
                            stats: fs.statSync(fullPath)
                        };
                    })
                    .filter(item => item.name !== 'node_modules');

                items.sort((a, b) => {
                    if (a.stats.isDirectory() && !b.stats.isDirectory()) return -1;
                    if (!a.stats.isDirectory() && b.stats.isDirectory()) return 1;
                    return a.name.localeCompare(b.name);
                });

                const children: DirectoryItem[] = [];

                items.forEach(item => {
                    if (item.name === 'node_modules') return;

                    if (item.stats.isDirectory()) {
                        const childTree = fastify.directoryTree(item.path, options, currentDepth + 1);
                        if (childTree) {
                            children.push(childTree);
                        }
                    } else {
                        children.push({
                            name: item.name,
                            path: item.path,
                            type: 'file',
                            size: item.stats.size
                        });
                    }
                });

                return {
                    name: baseName,
                    path: dirPath,
                    type: 'directory',
                    children
                };
            } catch (err) {
                console.error(`Error reading directory ${dirPath}:`, err);
                return null;
            }
        }
    )

    fastify.get('/__routes__', (request, reply) => {
        const routes = Object.fromEntries(fastify.routes);
        reply.code(200).send(routes)
    })

    fastify.get("/__directory_tree__", (request, reply) => {
        reply.code(200).send(request.server.directoryTree(process.env.PWD || root))
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
        routes: Map<string, any>,
        directoryTree: (dirPath: string, options?: DirectoryTreeOptions, currentDepth?: number) => DirectoryItem | null
    }
}