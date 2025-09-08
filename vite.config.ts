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
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "~plugins": path.resolve(__dirname, "./renderer/plugins")
    },
  },
};

export default config;
