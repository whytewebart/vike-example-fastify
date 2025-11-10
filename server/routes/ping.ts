import type { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/ping', {
    schema: {
      response: {
        200: {
          $ref: "server:ping"
        }
      }
    }
  }, async (request, reply) => {
    
    return reply.code(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      meta: {
        uptime: process.uptime() + ' seconds',
        version: '1.0.0',
      },
    })
  })
}

export default root;
