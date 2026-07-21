import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetWebFonts,
	presetWind4,
	transformerDirectives,
} from "unocss";
import type { Preset } from "unocss";

import { breakoutFn, breakoutGrid } from "./renderer/styles/presets/breakout";
import { presetShadcnVue } from "./renderer/styles/presets/shadcn";

const presets: Preset[] = [
	presetWind4({
		preflights: {
			theme: "on-demand",
		},
	}),
	presetShadcnVue(),
	presetAttributify(),
	presetWebFonts({
		provider: "google",
		fonts: {
			instrument: "Instrument Serif",
			urbanist: ["Urbanist", "Urbanist:400,500,600,700"],
			sans: ["Albert Sans", "Albert Sans:400,500,600,700"],
			mono: ["Chivo Mono", "Chivo Mono:400,500,600"],
		},
	}),
	presetIcons({
		prefix: "i-",
		extraProperties: {
			display: "inline-block",
			"vertical-align": "middle",
		},
		collections: {
			solar: () =>
				import("@iconify-json/solar/icons.json").then(
					(i) => i.default as any,
				),
			hugeicons: () =>
				import("@iconify-json/hugeicons/icons.json").then(
					(i) => i.default,
				),
			heroicons: () =>
				import("@iconify-json/heroicons/icons.json").then(
					(i) => i.default,
				),
		},
	}),
	breakoutGrid,
];

export default defineConfig({
	presets,
	rules: [
		[
			'diagonals', {
				'background-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cg fill='%23FDFDFD' stroke='%23EEEEEE' stroke-width='.5'%3E%3Cpolygon points='50,2 98,50 50,98 2,50'/%3E%3Cpolygon points='0,-48 48,0 0,48 -48,0'/%3E%3Cpolygon points='100,-48 148,0 100,48 52,0'/%3E%3Cpolygon points='0,52 48,100 0,148 -48,100'/%3E%3Cpolygon points='100,52 148,100 100,148 52,100'/%3E%3C/g%3E%3C/svg%3E")`,
				'background-size': '300px'
			}
		]
	],
	shortcuts: {
		"app-scrollbar":
			"[&::-webkit-scrollbar]:w-15px [&::-webkit-scrollbar]:opacity-1 [&::-webkit-scrollbar]:bg-alabaster [&::-webkit-scrollbar-track]:bg-alabaster [&::-webkit-scrollbar-track]:my-4px [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-4 [&::-webkit-scrollbar-thumb]:b-5px [&::-webkit-scrollbar-thumb]:b-solid [&::-webkit-scrollbar-thumb]:b-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content",
		"hide-scrollbar":
			"[&::-webkit-scrollbar]:w-15px [&::-webkit-scrollbar]:opacity-0 [&::-webkit-scrollbar]:transition-all",
		// ------------
		viewport: breakoutFn.defineGrid({
			// content: 585,
			content: 790,
			containers: [
				// { name: "min", value: 620 },
				{ name: "max", value: 940 },
				{ name: "full", value: 1100 },
				{ name: "nav", value: 1200 },
			],
		}),
		"router-link-active": "text-gray-700",
	},
	// ...UnoCSS options
	theme: {
		colors: {
			divider: "#BDBDBD",
			alabaster: "#FBFBFB",
			brand: "#1780E3",
		},
		breakpoints: {
			xsm: "410px",
			sm: "576px",
			md: "768px",
			xmd: "820px",
			lg: "1024px",
			xl: "1200px",
			xxl: "1400px",
		},
		spacing: {
			base: "640px",
			large: "790px",
			container: "900px",
		},
	},
	safelist: ["router-link-active"],
	preflights: [
		{
			layer: "layout",
			getCSS: ({ theme }: any) => /*css*/ `
        :root {
          --boundary: 650px;
          --boundary-bleed: 690px;
        }

        html,body {
          font-family: "Albert Sans";
        }

        h1,h2,h3,h4,h5,h6 {
          font-family: "Urbanist";
          font-weight: 500;
        }
      `,
		},
	],
	layers: {
		layout: -1,
	},
	transformers: [transformerDirectives()],
	content: {
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html)($|\?)/,
				"components/ui/**/*.{ts,tsx,vue,svelte}",
			],
		},
		filesystem: ["components/ui/**/*.{ts,tsx,vue,svelte}"],
	},
});
