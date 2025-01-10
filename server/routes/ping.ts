import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  
  fastify.get('/ping', async (request, reply) => {
    return reply.code(200).send({ ok: true })
  })
}

export default root;
