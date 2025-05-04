export { __dirname, port, root, isProduction }

// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/50052194#50052194

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`
const isProduction = process.env.NODE_ENV === "production";
const port = (process.env.PORT || isProduction ? 4500 : 9000) as number
