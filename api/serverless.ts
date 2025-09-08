import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
import { build } from "../dist/server/index.js"
let instance: FastifyInstance | null = null;

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`;

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  if (!instance) {
    instance = await build();
    
    // Debug route (optional)
    instance!.get('/debug-asset-paths', (request, reply) => {
      reply.send({
        static_paths: [
          path.join(root, 'dist/client/assets'),
          path.join(root, 'dist/client')
        ],
        cwd: process.cwd(),
        vercel: process.env.VERCEL === '1'
      });
    });

    await instance!.ready();
  }

  instance!.server.emit('request', req, reply)
}