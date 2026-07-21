import type { JSONSchema } from 'json-schema-to-ts';

// definitions
const post = {
    $id: "user:post",
    type: "object",
    properties: {
        name: { type: "string" },
        age: {
            type: "number",
            nullable: false
        },
        email: { type: "string", format: "email" }
    },
    required: ["name", "age", "email"]
} as const satisfies JSONSchema

const patch = {
    $id: "user:patch",
    type: "object",
    properties: {
        $id: { type: "string" },
        user: {
            $ref: "user:post"
        }
    },
    required: ["$id"]
} as const satisfies JSONSchema

// exports
export default {
    post,
    patch
}

declare global {
    namespace Registry {
        interface Schemas {
            post: typeof post
            patch: typeof patch
        }
    }
}