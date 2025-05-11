import { existsSync } from "fs";
import { extname, dirname } from "path";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
import type { Plugin } from "vite";

export default ({
  extensions = ["png", "jpg"],
  logger = false,
}: VitePluginWebpGenerator): Plugin => {
  let isBuild = false;

  return {
    name: "vite-plugin-webp-generator",
    enforce: "post",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    async transform(_, id) {
      if (!isBuild) {
        // console.info("Vite plugin webp-generator only runs during build.");
        return null; // Only run during build
      }
      
      if (
        new RegExp(`\\.(${extensions.join("|")})$`).test(id) &&
        !id.includes("node_modules")
      ) {
        const webpPath = id.replace(extname(id), ".webp");
        if (!existsSync(webpPath)) {
          await mkdir(dirname(webpPath), { recursive: true });
          const buffer = await sharp(id).webp().toBuffer();
          await writeFile(webpPath, buffer);
          logger && console.info(`Generated: ${webpPath}`);
        }
      }
      return null;
    },
  };
};
