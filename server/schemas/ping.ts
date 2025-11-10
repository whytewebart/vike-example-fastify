import type { JSONSchema } from 'json-schema-to-ts';

// definitions
const ping = {
    $id: "server:ping",
    type: "object",
    properties: {
        status: {
            enum: ['ok', 'error']
        },
        timestamp: {
            type: "string",
            format: "date-time"
        },
        meta: {
            type: "object",
            properties: {
                uptime: {
                    type: "string"
                },
                version: {
                    type: "string"
                }
            },
            required: ["uptime", "version"]
        }
    },
    required: ["status", "timestamp", "meta"]
} as const satisfies JSONSchema

// exports
export default {
    ping
}

declare global {
    namespace Registry {
        interface Schemas {
            ping: typeof ping
        }
    }
}