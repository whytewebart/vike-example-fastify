import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { vercel } from "vite-plugin-vercel/vite";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import TailwindCSS from "@tailwindcss/vite";
import UnoCSS from "unocss/vite";

import vike from "vike/plugin";
import { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
	plugins: [
		vue(),
		vueJsx(),
		vike(),
		vercel(),
		// TailwindCSS(),
		UnoCSS(),
		AutoImport({
			imports: [
				"vue",
				"@vueuse/core",
				{
					pinia: ["storeToRefs", "defineStore"],
				},
			],
			dirs: ["./composables/**"],
		}),
		Components({
			dirs: ["./components"],
		}),
	],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
			"@plugins": path.resolve(__dirname, "./renderer/plugins"),
		},
	},
};

export default config;
