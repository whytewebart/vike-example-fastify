import { FromSchema, FromSchemaOptions } from "json-schema-to-ts";

import type {
	FastifyPluginAsyncJsonSchemaToTs,
	JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts";

import type {
	FastifyInstance,
	FastifyBaseLogger,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from "fastify";
import { ObjectId } from "mongodb";

export {};

type deserialize = [
	{
		pattern: {
			type: "string";
			format: "date-time";
		};
		output: Date;
	},
	{
		pattern: {
			type: "string";
			format: "objectId";
		};
		output: ObjectId;
	},
];

type suboptions = {
	references: Registry.Schemas[keyof Registry.Schemas][];
	deserialize: deserialize;
	parseNotKeyword: true;
	parseIfThenElseKeywords: true;
};

type typeOptions = {
	ValidatorSchemaOptions: suboptions;
	SerializerSchemaOptions: suboptions;
};

declare global {
	type FastifyTyped = FastifyInstance<
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		RawReplyDefaultExpression<RawServerDefault>,
		FastifyBaseLogger,
		JsonSchemaToTsProvider<typeOptions>
	>;

	type FastifyTypeBox = FastifyPluginAsyncJsonSchemaToTs<typeOptions>;

	namespace Registry {
		type Id = string | ObjectId;
		interface Schemas {}
		type select<T extends keyof Registry.Schemas> = FromSchema<
			Registry.Schemas[T],
			suboptions
		>;
	}

	type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	type DeepPartial<T> = T extends Function
		? T
		: T extends Array<infer U>
			? Array<DeepPartial<U>>
			: T extends object
				? { [K in keyof T]?: DeepPartial<T[K]> }
				: T;

	// Recursive helper to generate dot-notation paths
	type DotPaths<T, Prefix extends string = ""> = {
		[K in keyof T & string]: T[K] extends object
			? DotPaths<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
			: `${Prefix}${K}`;
	}[keyof T & string];
}

declare module "fastify" {
	interface FastifyInstance {
		getSchema<T>(name: string): T;
	}

	interface FastifyRequest {
		[key: `mem_${string}`]: any;
	}
}
