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
  let publicDir = "";

  return {
    name: "vite-plugin-webp-generator",
    enforce: "post",
    configResolved(config) {
      isBuild = config.command === "build";
      publicDir = config.publicDir;
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
        var relativePath = id.startsWith('/') ? `public${id}` : id;

        var webpPath = relativePath.replace(extname(relativePath), ".webp");

        console.info(`Processing: ${relativePath} -> ${webpPath}`);

        if (!existsSync(webpPath)) {
          await mkdir(dirname(webpPath), { recursive: true });
          const buffer = await sharp(relativePath).webp().toBuffer();
          await writeFile(webpPath, buffer);
          logger && console.info(`Generated: ${webpPath}`);
        }
      }
      return null;
    },
  };
};
