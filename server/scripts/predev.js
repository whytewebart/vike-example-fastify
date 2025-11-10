import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '../../');

// Configurable paths
const TARGET_DIR = path.join(__dirname, 'dist'); // Where to put the .env
const ENV_FILE_NAME = '.env';
const TARGET_ENV_PATH = path.join(TARGET_DIR, ENV_FILE_NAME);

// Optional: path to another .env file (could be passed via CLI or hardcoded)
const sourceEnvPath = process.argv[2]  // CLI arg: node createEnvFile.js ./path/to/.env
  ? path.resolve(process.argv[2])
  : path.join(__dirname, ENV_FILE_NAME); // Default: root .env

// Default env variables if no source file is copied
const defaultEnv = {
    FASTIFY_STATUS: 'healthy'
};

// Format object to .env string
function formatEnv(vars) {
  return Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`✅ Created directory: ${TARGET_DIR}`);
}

// Copy or create .env
if (fs.existsSync(sourceEnvPath)) {
  // Copy from source
  fs.copyFileSync(sourceEnvPath, TARGET_ENV_PATH);
  console.log(`✅ Copied .env from: ${sourceEnvPath}`);
} else {
  // Create default .env
  const envContent = formatEnv(defaultEnv);
  fs.writeFileSync(TARGET_ENV_PATH, envContent);
  console.log(`✅ Created default .env at: ${TARGET_ENV_PATH}`);
}
