import fastify, { FastifyServerOptions } from 'fastify'
import rawBody from 'fastify-raw-body'
import { apply, serve } from '@photonjs/fastify'

import autoLoad from "@fastify/autoload";
import { join } from "path";
import { __dirname, prod } from "./root.ts";

// ajv
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import ajvMerge from 'ajv-merge-patch';

const shared: FastifyServerOptions = {
  ajv: {
    customOptions: {
      allErrors: true,
      useDefaults: true,
      messages: true,
    },

    plugins: [
      [ajvErrors.default, {
        keepErrors: true,
        singleError: false
      }],
      [addFormats.default, {}],
      [ajvMerge, {}]
    ]
  }
};

const production = Object.assign(shared, { logger: true });
const development = Object.assign(shared, {
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
});

export const build = async () => {
  // Fastify entry point
  const instance = fastify(prod ? production : development)
  const __directory = prod ? join(__dirname, '../build') : __dirname;

  // ⚠️ Mandatory for Vike middleware
  await instance.register(rawBody)
  // LOAD PLUGINS AND ROUTES
  instance.register(autoLoad, { dir: join(__directory, "plugins") });
  instance.register(autoLoad, { dir: join(__directory, "routes") });
  instance.register(autoLoad, {
    dir: join(__directory, 'schemas'),
    indexPattern: /^loader.ts$/i
  })

  await apply(instance)
  return instance
}

async function startServer() {

  if (process.env.VERCEL) {
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

export default await startServer()