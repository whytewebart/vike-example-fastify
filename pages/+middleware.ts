import { redirect } from "vike/abort";
export { middleware };

// this is a middleware that runs on the client, idea from Nuxt js.
// it is a replacement for +guard.ts file, best used in SPA.
const middleware: MiddlewareAsync = async (pageContext) => {
  console.log("middleware run on client")
};

function sleep(milliseconds: number) {
  return new Promise((r) => setTimeout(r, milliseconds));
}
