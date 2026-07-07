import type { Ajv } from "ajv";
// import { ObjectId } from "mongodb";

type ObjectIdPlugin = (ajv: Ajv) => void;
export const ajvObjectIdPlugin: ObjectIdPlugin = (ajv) => {
	// ajv.addFormat("objectId", {
	// 	type: "string",
	// 	validate: (value: string) => ObjectId.isValid(value),
	// });

	// LOG OBJECTID NOT IMPLEMENTED
	console.warn("ajvObjectIdPlugin: ObjectId format is not implemented");

	return ajv;
};
