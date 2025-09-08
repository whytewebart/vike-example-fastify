import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import vercel from 'vite-plugin-vercel';
import UnoCSS from "unocss/vite";

import vike from "vike/plugin";
import { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  plugins: [
    vue(),
    vike(),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        {
          pinia: ["storeToRefs", "defineStore"],
        }
      ],
      dirs: ["./composables/**"],
    }),
    Components({
      dirs: ["./components"],
      directoryAsNamespace: true,
    }),
    vercel({
      source: "/.*",
    })
  ],

  vercel: {
    additionalEndpoints: [
      {
        // entry file to the server. Default export must be a node server or a function
        source: "server/vike.ts",
        // replaces default Vike target
        destination: "ssr_",
        // already added by default Vike route
        route: false,
      },
    ],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "~plugins": path.resolve(__dirname, "./renderer/plugins")
    },
  },
};

export default config;
