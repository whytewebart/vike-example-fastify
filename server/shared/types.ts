import {
	type FastifyBaseLogger,
	type FastifyInstance,
	type RawReplyDefaultExpression,
	type RawRequestDefaultExpression,
	type RawServerDefault,
} from "fastify";
import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
declare global {
	type FastifyTypebox = FastifyInstance<
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		RawReplyDefaultExpression<RawServerDefault>,
		FastifyBaseLogger,
		JsonSchemaToTsProvider
	>;
}
