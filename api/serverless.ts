import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
// @ts-ignore
import { build } from "../dist/server/index.js"
let instance: FastifyInstance | null = null;

export default async function handler(req: FastifyRequest, reply: FastifyReply) {
  if (!instance) {
    instance = await build();
    await instance!.ready();
  }

  instance!.server.emit('request', req, reply)
}