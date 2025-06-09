import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite"
import UnoCSS from "unocss/vite";

import vike from "vike/plugin";
import { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    vueJsx(),
    vike(),
    UnoCSS({
      mode: "shadow-dom"
    }),
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
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "assets": path.resolve(__dirname, "./assets/")
    },
  },

  optimizeDeps: {
    exclude: [
      './renderer/styles/primevue/aura'
    ]
  },

  esbuild: {
    keepNames: true
  }
};

export default config;
