import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

// CUSTOM SCHEMA && STRING FORMATTING
import { Ajv } from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
// ------------------------------
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    messages: true,
});
// --------
ajvErrors.default(ajv, {
    keepErrors: true,
    singleError: false
}); addFormats.default(ajv);
// ------------------------------
export default fp<FastifyPluginAsync>(async (fastify, opts) => {
    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return ajv.compile(schema)
    });

    fastify.setErrorHandler(function (error, request, reply) {
        if (error.validation) {
            reply.status(400).send({
                status: 400,
                // ------------------------
                brief: "Schema Error",
                error: "Failed Validation",
                // -----------
                details: error.validation.map(({ keyword, params, message, instancePath }) => ({
                    ['keyword']: keyword,
                    ['target']: instancePath.slice(1) || params?.missingProperty,
                    ['instance']: keyword !== 'errorMessage' ? params[Object.keys(params)[0]] : params.errors,
                    ['message']: message
                })),
                // -----
                message: error.validation?.find(f => f.keyword === 'errorMessage')?.message
            });
            return
        }
        reply.send(error)
    });

    fastify.register(function (instance, options, done) {
        instance.setNotFoundHandler(function (request, reply) {
            instance.log.error("Not Found")
            reply.status(404).send({
                status: '404 Not Found',
                message: "Route doesn't exist"
            })
        })
        done()
    });

    fastify.get("/validate", {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    excitement: { type: 'integer' }
                },
                required: ['name']
            }
        }
    }, (request, reply) => {
        reply.send("validated route")
    })

    fastify.ready(err => {
        if (err) throw new Error(err.message)
        fastify.log.info(`Validators initialized`)
    })
}, {
    name: 'validators'
})