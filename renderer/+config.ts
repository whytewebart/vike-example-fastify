import type { Config, ConfigEffect } from "vike/types";
import * as config from '@vite-plugin-vercel/vike/config';
import vikeServer from 'vike-server/config'

const toggleSsrRelatedConfig: ConfigEffect = ({
  configDefinedAt,
  configValue,
}) => {
  if (typeof configValue !== "boolean") {
    throw new Error(`${configDefinedAt} should be a boolean`);
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
          ? { server: true, client: true } // default
          : { client: true },
      },

      Layout: {
        env: configValue
          ? { server: true, client: true } //default
          : { client: true },
      },
    },
  };
};

const meta: Config["meta"] = {
  Layout: {
    env: { server: true, client: true },
    cumulative: true
  },

  unhead: {
    env: {
      server: true,
      client: true,
    },

    cumulative: true,
  },

  ssrSlot: {
    env: {
      server: true,
      client: true
    }
  },

  secrets: {
    env: { server: true },
  },

  onCreateApp: {
    env: { server: true, client: true },
    cumulative: true,
  },

  onHydrateClient: {
    env: { server: false, client: true },
    cumulative: true,
  },

  middleware: {
    env: { server: false, client: true },
    cumulative: true,
  },

  onAfterRenderHtml: {
    env: { server: true },
    cumulative: true,
  },

  nested: {
    env: { server: true, client: true },
  },

  ssr: {
    env: { config: true },
    effect: toggleSsrRelatedConfig,
  },
};

const unhead: Config["unhead"] = {
  titleTemplate: "Vike & Fastify - %s",
  link: [
    {
      href: "/favicon-dark.svg",
      rel: "icon",
      media: "(prefers-color-scheme: light)",
    },
    {
      href: "/favicon.svg",
      rel: "icon",
      media: "(prefers-color-scheme: dark)",
    },
  ],

  meta: [
    {
      charset: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ],

  htmlAttrs: {
    lang: "en",
    // class: ["dark"]
  },

  bodyAttrs: {
    class: ["text-sm"],
  },
};

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,
  // https://vike.dev/meta
  meta,
  hydrationCanBeAborted: true,
  passToClient: ["pageProps", "routeParams", "_piniaInitialState", "_hello", "headersOriginal"],

  unhead,
  // ssr: false,
  // server: 'server/vike.ts',
  // extends: [vikeServer, config]
  extends: [config]
} satisfies Config;
