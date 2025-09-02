// https://vike.dev/onRenderClient
export { onRenderClient };

import { App } from "vue";
import { type ChangePage, createApp } from "./app";
import type { OnRenderClientAsync, PageContext } from "vike/types";
import { objectAssign } from "./utils";

let app: App | undefined;
let changePage: ChangePage | undefined;
const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
  // to support SPA
  if (!pageContext.Page)
    throw new Error(
      "onRenderClient() hook expects pageContext.Page to be defined"
    );

  if (!app) {
    // First rendering/hydration
    /**
     * If the container is empty, it means the page is client-side rendered. Otherwise, it's server-side rendered.
     * If the ssrSlot is defined, we check if it's empty to determine if the page (nested) is client-side rendered.
     */
    const container = document.getElementById("app")!;
    const ssrSlot = pageContext.config.ssrSlot
      ? document.getElementById(pageContext.config.ssrSlot)
      : null;

    const ssr = ssrSlot
      ? ssrSlot?.children.length !== 0
      : container.children.length > 0;

    // console.log(ssrSlot?.children);
    // console.log(ssr);

    const res = await createApp(pageContext, ssr);

    app = res.app;
    changePage = res.changePage;
    objectAssign(pageContext, { app });

    if (!ssr) await executeHook(pageContext.config.middleware, pageContext);

    app.mount(container);
  } else {
    objectAssign(pageContext, { app });

    await executeHook(pageContext.config.middleware, pageContext);
    await changePage!(pageContext);
  }
};

type Hook = (pageContext: PageContext) => unknown;
type PlainHook = unknown;

function executeHook<T extends Hook | PlainHook, C extends PageContext>(
  hooks: T[] | undefined,
  pageContext: C
) {
  return Promise.all(
    hooks?.map((hook) =>
      typeof hook === "function" ? hook(pageContext) : hook
    ) ?? []
  );
}
