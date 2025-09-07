import fastify from 'fastify'
import rawBody from 'fastify-raw-body'
import { apply } from 'vike-server/fastify'
import { serve } from 'vike-server/fastify/serve'

import autoLoad from "@fastify/autoload";
import { join } from "path";
import { __dirname } from "./root.js";

async function startServer() {
  const instance = fastify({
    // ⚠️ Mandatory for HMR support
    forceCloseConnections: true
  })

  // ⚠️ Mandatory for Vike middleware
  await instance.register(rawBody)
  // await instance.register(import("@fastify/compress"), { global: true });
  // LOAD PLUGINS AND ROUTES
  // instance.register(autoLoad, { dir: join(__dirname, "plugins") });
  // instance.register(autoLoad, { dir: join(__dirname, "routes") });

  // @ts-ignore
  instance.register(import("./routes/ping"))

  instance.get("/server-route", (req, res) => {
    res.send({ hello: "World" });
  });

  await apply(instance)
  return serve(instance, {
    // options
    port: 3000,
    hostname: 'localhost'
  })
}

export default startServer()