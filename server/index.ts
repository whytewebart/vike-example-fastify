// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + Vike examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.dev/) to scaffold a Vike + HatTip app. Note that Bati generates apps that use the V1 design (https://vike.dev/migration/v1-design) and Vike packages (https://vike.dev/vike-packages)

import Fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { renderPage, createDevMiddleware } from "vike/server";

import { root, __dirname } from "./root.js";
import { join } from "path";

const isProduction = process.env.NODE_ENV === "production";
const production = { logger: true };
const development = {
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
};

export const instance = Fastify(isProduction ? production : development);
async function buildServer() {
  // fastify autoload routes and plugins
  instance.register(autoLoad, { dir: join(__dirname, "plugins") });
  await instance.register(import("@fastify/compress"), { global: true });
  instance.register(autoLoad, { dir: join(__dirname, "routes") });

  if (isProduction) {
    await instance.register(import("@fastify/static"), {
      root: root + "/dist/client/assets",
      prefix: "/assets/",
    });

    await instance.register(import("@fastify/static"), {
      root: root + "/dist/client",
      decorateReply: false,
      wildcard: false,
    });
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })

    // this is middleware for vite's dev servert
    instance.addHook("onRequest", async (request, reply) => {
      const next = () =>
        new Promise<void>((resolve) => {
          // viteDevMiddleware(request.raw, reply.raw, () => resolve());
          devMiddleware(request.raw, reply.raw, () => resolve());
        });
      await next();
    });
  }

  instance.get("/server-route", (req, res) => {
    res.send({ hello: "World" });
  });

  instance.get("*", async (request, reply) => {
    const pageContextInit = {
      urlOriginal: request.raw.url || "",
      headersOriginal: request.headers
    };

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return reply.callNotFound();

    const { statusCode, headers } = httpResponse;

    headers.forEach(([name, value]) => reply.raw.setHeader(name, value));

    reply.status(statusCode);
    httpResponse.pipe(reply.raw);
    return reply;
  });

  return instance;
}

async function main() {
  const fastify = await buildServer();

  const port = (process.env.PORT || (isProduction ? 4000 : 3040)) as number;
  fastify.listen({ port: port }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });

  return fastify;
}

export default await main();
