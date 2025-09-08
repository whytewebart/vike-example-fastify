import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/ping', async (request, reply) => {
    return reply.code(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      meta: {
        uptime: process.uptime() + ' seconds',
        version: '1.0.5',
      },
    })
  })
}

export default root;
