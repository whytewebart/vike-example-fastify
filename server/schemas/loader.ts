import fp from "fastify-plugin";
import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
// IMPORT SCHEMAS
import imports from "../utils/imports.ts";

export default fp<FastifyTypeBox>(async function (fastify, opts) {
    const modules = await imports.loadModules("./server/schemas", /^loader.ts$/i);
    const schemas = Object.values(modules)
        .flatMap((mod) => Object.entries(mod).map(([_, val]) => val))
    // Register all schemas with Fastify
    schemas.forEach((schema) => fastify.addSchema(schema));

    fastify.ready(err => {
        if (err) throw new Error(err.message);
        fastify.log.info(`Schemas initialized`)
    })
}, {
    name: "schemas",
    dependencies: [
        "validators"
    ]
});

declare global {

    type FastifyTypeBox = FastifyPluginAsyncJsonSchemaToTs<{
        ValidatorSchemaOptions: {
            references: Registry.Schemas[keyof Registry.Schemas][]
        };

        SerializerSchemaOptions: {
            references: Registry.Schemas[keyof Registry.Schemas][]
        };
    }>
}
