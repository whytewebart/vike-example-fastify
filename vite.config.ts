import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
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
      imports: ["vue"],
      dirs: ["./composables/**"],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
};

export default config;
