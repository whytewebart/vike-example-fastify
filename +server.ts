// +server.ts
import type { Server } from "vike/types";
import vike, { toFetchHandler } from "@vikejs/fastify";
import { build, instance as app } from "./server/runtime/entry";

let appPromise: Promise<Awaited<ReturnType<typeof build>>> | undefined;

function getApp() {
	if (!appPromise) {
		appPromise = (async () => {
			const instance = await app();
			/* [01] INSTALL VIKE */ await vike(instance);
			/* [02] ATTACH SERVER */ await build(instance);
			await instance.ready();
			return instance;
		})();
	}
	return appPromise;
}

export default {
	fetch: async (request: Request) => {
		const app = await getApp();
		return toFetchHandler(app.routing)(request);
	},
} satisfies Server;
