export { _dirname, __directory };
// IMPORTS
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const _dirname = join(dirname(fileURLToPath(import.meta.url)), "../");
const __directory = join(_dirname, "/..");
