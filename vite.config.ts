import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite"
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import UnoCSS from "unocss/vite";
import imageCompressor from "./renderer/plugins/image-compressor";
import vercel from 'vite-plugin-vercel';

import vike from "vike/plugin";
import { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  plugins: [
    vue(),
    vueJsx(),
    vike(),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        {
          primevue: ["useDialog"],
          pinia: ["storeToRefs", "defineStore"],
        }
      ],
      dirs: ["./composables/**"],
    }),
    Components({
      dirs: ["components"],
      resolvers: [PrimeVueResolver()],
      directoryAsNamespace: true,
    }),
    imageCompressor({
      extensions: ["png", "jpg"],
      logger: true,
    }),
    // vercel({
    //   source: "/.*"
    // })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "assets": path.resolve(__dirname, "./assets/")
    },
  },
};

export default config;
