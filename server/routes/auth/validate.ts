export default (async (fastify, opts) => {

    fastify.post('/register', {
        schema: {
            body: {
                $ref: "user:post"
            },
            response: {
                200: {
                    $ref: "user:patch"
                }
            }
        }
    }, (request, reply) => {

        console.log(request.body)
        reply.send({
            user: request.body,
            $id: "9"
        })
    })

}) as FastifyTypeBox