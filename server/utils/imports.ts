// importAllFromDir.js
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

async function loadModules(dirPath: string, ignoreRegex: RegExp | null = null) {
  const fullPath = path.resolve(dirPath);
  const files = await fs.readdir(fullPath);

  const modules: Record<string, any> = {};

  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    if (ignoreRegex && ignoreRegex.test(file)) continue;

    const fileUrl = pathToFileURL(path.join(fullPath, file)).href;
    const mod = await import(fileUrl);

    modules[base] = mod.default || mod; // support both default and named exports
  }

  return modules;
}

export default {
    loadModules
};