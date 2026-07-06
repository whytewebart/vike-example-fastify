/**
 * uno-preset-shadcn-vue
 * -----------------------------------------------------------------------
 * A minimal, dependency-free UnoCSS preset that reproduces the pieces of
 * shadcn-vue's Tailwind config that don't already come from @unocss/preset-wind3:
 *   - the semantic color tokens (background, foreground, primary, card, ...)
 *   - the radius scale driven by --radius
 *   - the sidebar + chart color tokens used by newer shadcn-vue components
 *   - the CSS variables themselves (light + dark), as a preflight
 *
 * It intentionally does NOT reimplement tailwindcss-animate's `animate-in`
 * /`animate-out` utilities (fade/zoom/slide-in-from-*, etc.) — reka-ui's
 * transitions rely on a lot of moving parts there. Pair this with
 * `unocss-preset-animations` for that, or add your own `accordion-down`/
 * `accordion-up`/`collapsible-*` keyframes via theme.animation if you only
 * need those two.
 *
 * Usage:
 *   import { defineConfig } from "unocss";
 *   import { presetWind3 } from "@unocss/preset-wind3";
 *   import presetAnimations from "unocss-preset-animations";
 *   import { presetShadcnVue } from "./preset-shadcn-vue";
 *
 *   export default defineConfig({
 *     presets: [
 *       presetWind3(),
 *       presetAnimations(),
 *       presetShadcnVue(),
 *     ],
 *   });
 */
import { definePreset } from "unocss";
import type { Preset } from "unocss";

export interface ShadcnVuePresetOptions {
	/**
	 * Selector used to toggle dark mode. shadcn-vue's default `useColorMode()`
	 * setup from VueUse toggles a `dark` class on <html>, matching
	 * presetWind3's default `dark:` variant (`.dark $`), so you normally don't
	 * need to change this.
	 */
	darkSelector?: string;
	/**
	 * Set to false if you already define the CSS variables yourself (e.g. in
	 * your shadcn-vue-generated global.css) and only want the color/radius
	 * theme mappings from this preset, not the injected :root/.dark block.
	 * @default true
	 */
	injectVariables?: boolean;
}

export function presetShadcnVue(options: ShadcnVuePresetOptions = {}) {
	const { darkSelector = ".dark", injectVariables = true } = options;

	return {
		name: "unocss-preset-shadcn-vue",
		theme: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground":
						"hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground":
						"hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			// reka-ui (radix-vue's successor) exposes content height as
			// --reka-accordion-content-height / --reka-collapsible-content-height.
			// If you're on an older radix-vue version, swap the var names below
			// for --radix-accordion-content-height / --radix-collapsible-content-height.
			animation: {
				keyframes: {
					"accordion-down":
						"{from{height:0}to{height:var(--reka-accordion-content-height)}}",
					"accordion-up":
						"{from{height:var(--reka-accordion-content-height)}to{height:0}}",
					"collapsible-down":
						"{from{height:0}to{height:var(--reka-collapsible-content-height)}}",
					"collapsible-up":
						"{from{height:var(--reka-collapsible-content-height)}to{height:0}}",
				},
				durations: {
					"accordion-down": "0.2s",
					"accordion-up": "0.2s",
					"collapsible-down": "0.2s",
					"collapsible-up": "0.2s",
				},
				timingFns: {
					"accordion-down": "ease-out",
					"accordion-up": "ease-out",
					"collapsible-down": "ease-in-out",
					"collapsible-up": "ease-in-out",
				},
				counts: {
					"accordion-down": "1",
					"accordion-up": "1",
					"collapsible-down": "1",
					"collapsible-up": "1",
				},
			},
		},
		preflights: injectVariables
			? [
					{
						getCSS: () =>
							`
								:root {
								  --background: 0 0% 100%;
								  --foreground: 240 10% 3.9%;
								  --card: 0 0% 100%;
								  --card-foreground: 240 10% 3.9%;
								  --popover: 0 0% 100%;
								  --popover-foreground: 240 10% 3.9%;
								  --primary: 240 5.9% 10%;
								  --primary-foreground: 0 0% 98%;
								  --secondary: 240 4.8% 95.9%;
								  --secondary-foreground: 240 5.9% 10%;
								  --muted: 240 4.8% 95.9%;
								  --muted-foreground: 240 3.8% 46.1%;
								  --accent: 240 4.8% 95.9%;
								  --accent-foreground: 240 5.9% 10%;
								  --destructive: 0 84.2% 60.2%;
								  --destructive-foreground: 0 0% 98%;
								  --border: 240 5.9% 90%;
								  --input: 240 5.9% 90%;
								  --ring: 240 5.9% 10%;
								  --radius: 0.5rem;
								  --chart-1: 12 76% 61%;
								  --chart-2: 173 58% 39%;
								  --chart-3: 197 37% 24%;
								  --chart-4: 43 74% 66%;
								  --chart-5: 27 87% 67%;
								  --sidebar-background: 0 0% 98%;
								  --sidebar-foreground: 240 5.3% 26.1%;
								  --sidebar-primary: 240 5.9% 10%;
								  --sidebar-primary-foreground: 0 0% 98%;
								  --sidebar-accent: 240 4.8% 95.9%;
								  --sidebar-accent-foreground: 240 5.9% 10%;
								  --sidebar-border: 220 13% 91%;
								  --sidebar-ring: 217.2 91.2% 59.8%;
								}

								${darkSelector} {
								  --background: 240 10% 3.9%;
								  --foreground: 0 0% 98%;
								  --card: 240 10% 3.9%;
								  --card-foreground: 0 0% 98%;
								  --popover: 240 10% 3.9%;
								  --popover-foreground: 0 0% 98%;
								  --primary: 0 0% 98%;
								  --primary-foreground: 240 5.9% 10%;
								  --secondary: 240 3.7% 15.9%;
								  --secondary-foreground: 0 0% 98%;
								  --muted: 240 3.7% 15.9%;
								  --muted-foreground: 240 5% 64.9%;
								  --accent: 240 3.7% 15.9%;
								  --accent-foreground: 0 0% 98%;
								  --destructive: 0 62.8% 30.6%;
								  --destructive-foreground: 0 0% 98%;
								  --border: 240 3.7% 15.9%;
								  --input: 240 3.7% 15.9%;
								  --ring: 240 4.9% 83.9%;
								  --chart-1: 220 70% 50%;
								  --chart-2: 160 60% 45%;
								  --chart-3: 30 80% 55%;
								  --chart-4: 280 65% 60%;
								  --chart-5: 340 75% 55%;
								  --sidebar-background: 240 5.9% 10%;
								  --sidebar-foreground: 240 4.8% 95.9%;
								  --sidebar-primary: 224.3 76.3% 48%;
								  --sidebar-primary-foreground: 0 0% 100%;
								  --sidebar-accent: 240 3.7% 15.9%;
								  --sidebar-accent-foreground: 240 4.8% 95.9%;
								  --sidebar-border: 240 3.7% 15.9%;
								  --sidebar-ring: 217.2 91.2% 59.8%;
								}

								* {
								  border-color: hsl(var(--border));
								}

								body {
								  background-color: hsl(var(--background));
								  color: hsl(var(--foreground));
								}
							`.trim(),
					},
				]
			: [],
	} satisfies Preset;
}

export default presetShadcnVue;
