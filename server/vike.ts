import fastify from 'fastify'
import rawBody from 'fastify-raw-body'
import { apply } from 'vike-server/fastify'
import { serve } from 'vike-server/fastify/serve'

import autoLoad from "@fastify/autoload";
import { join } from "path";
import { __dirname } from "./root.js";

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
  forceCloseConnections: true // ⚠️ Mandatory for HMR support 
};

const isProduction = process.env.NODE_ENV === "production";

export const build = async () => {
  // Fastify entry point
  const instance = fastify(isProduction ? production : development)

  // ⚠️ Mandatory for Vike middleware
  await instance.register(rawBody)
  // LOAD PLUGINS AND ROUTES
  instance.register(autoLoad, { dir: join(__dirname, "../build", "plugins") });
  instance.register(autoLoad, { dir: join(__dirname, "../build", "routes") });

  instance.get("/server-route", (req, res) => {
    res.send({ hello: "World" });
  });

  await apply(instance)
  return instance
}

async function startServer() {

  if(process.env.VERCEL) {
    console.log("Running in Vercel environment, skipping standalone server start.")
    return;
  }

  const instance = await build()
  return serve(instance, {
    // options
    port: (process.env.PORT || 3000) as number,
    hostname: '0.0.0.0'
  })
}

export default startServer()