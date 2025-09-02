import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";
import type { Preset } from "unocss";
import { readFile } from "fs/promises";
import { breakoutFn, breakoutGrid } from "./renderer/styles/presets/breakout";
import transformerDirectives from "@unocss/transformer-directives";

const presets: Preset[] = [
  presetUno(),
  presetAttributify(),
  presetWebFonts({
    provider: "google",
    fonts: {
      urbanist: ["Urbanist", "Urbanist:400,500,600,700"],
      homizio: {
        name: "Homizio",
        weights: [100, 300, 400, 500, 700, 900],
        provider: "none",
      },
      sans: ["DM Sans", "DM Sans:400,500,600,700"],
    },
  }),
  presetTypography({
    selectorName: "type",
    cssExtend: {},
  }),
  presetIcons({
    prefix: "i-",
    extraProperties: {
      display: "inline-block",
      "vertical-align": "middle",
      // 'margin-top': '-2px'
    },
    collections: {
      // @ts-ignore
      solar: () =>
        import("@iconify-json/solar/icons.json").then((i) => i.default),
    },
  }),
  breakoutGrid,
];

export default defineConfig({
  presets,
  rules: [["remove-margin", { "--gap": "0em" }]],
  shortcuts: {
    boundary: "max-w-[var(--boundary)]",
    "boundary-bleed": "max-w-[var(--boundary-bleed)]",
    // ------------
    "app-scrollbar":
      "[&::-webkit-scrollbar]:w-15px [&::-webkit-scrollbar]:opacity-1 [&::-webkit-scrollbar]:bg-alabaster [&::-webkit-scrollbar-track]:bg-alabaster [&::-webkit-scrollbar-track]:my-4px [&::-webkit-scrollbar-thumb]:bg-gray-7 [&::-webkit-scrollbar-thumb]:rounded-4 [&::-webkit-scrollbar-thumb]:b-5px [&::-webkit-scrollbar-thumb]:b-solid [&::-webkit-scrollbar-thumb]:b-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content",
    "hide-scrollbar":
      "[&::-webkit-scrollbar]:w-15px [&::-webkit-scrollbar]:opacity-0 [&::-webkit-scrollbar]:transition-all",
    // ------------
    viewport: breakoutFn.defineGrid({
      content: 585,
      containers: [
        { name: 'min', value: 620 },
        { name: 'max', value: 790 },
        { name: 'full', value: 900 },
        { name: 'nav', value: 1130 }
      ]
    }),
    "router-link-active": "text-gray-7",
  },
  // ...UnoCSS options
  theme: {
    colors: {
      divider: "#BDBDBD",
      alabaster: "#FBFBFB",
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
          font-family: "DM Sans";
          font-size: 14px;
        }

        h1,h2,h3,h4,h5,h6 {
          font-family: "Urbanist";
          font-weight: 500;
        }
      `,
    },
    {
      layer: "custom-reset",
      getCSS: async () =>
        await cssToString("node_modules/@unocss/reset/tailwind-compat.css"),
    },
  ],
  layers: {
    layout: -1,
  },
  transformers: [transformerDirectives()],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        "./renderer/styles/primevue/**/*.{vue,js,ts,jsx,tsx}",
      ],
    },
  },
});

/**
 * Asynchronously fetches and reads a CSS file from a given URL and returns its content as a string.
 *
 * @param {string} url - The URL of the CSS file to be fetched and read.
 * @returns {Promise<string | undefined>} - A promise that resolves to the content of the CSS file as a string, or undefined if an error occurs.
 *
 * @throws {Error} - If there is an error reading the file, it logs the error message to the console.
 */
async function cssToString(url: string) {
  const stylesheet_url = new URL(url, import.meta.url);
  var stylesheet;

  try {
    stylesheet = await readFile(stylesheet_url, { encoding: "utf8" });
  } catch (err: any) {
    console.error(err.message);
  }

  return stylesheet;
}
