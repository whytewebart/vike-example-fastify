export { createApp };
export type { ChangePage };

import {
  type App,
  createApp as createVueApp,
  createSSRApp,
  h,
  nextTick,
  shallowRef,
} from "vue";
import type { PageContext } from "vike/types";
import {
  assertDataIsObject,
  callCumulativeHooks,
  objectAssign,
} from "./utils";
import { Component } from "./types";
import PageShell from "./PageShell.vue";
import { useUnhead } from "./plugins/unhead";

type ChangePage = (pageContext: PageContext) => Promise<void>;

// Helper to normalize the Layout property into a consistent array
const normalizeLayouts = (Layout: unknown): Component[] => {
  if (!Layout) return [];
  return Array.isArray(Layout) ? Layout : [Layout as Component];
};

async function createApp(pageContext: PageContext, ssr: boolean = true) {
  const pageContextRef = shallowRef(pageContext);
  // Default to empty object instead of undefined to avoid reactivity issues
  const dataRef = shallowRef(pageContext.data ?? {});
  const pageRef = shallowRef(pageContext.Page);
  const layoutRef = shallowRef<Component[]>(normalizeLayouts(pageContext.config.Layout));

  const PageWithLayout = {
    render() {
      const layouts = layoutRef.value;
      const PageVNode = h(pageRef.value);

      if (!layouts || layouts.length === 0) {
        return PageVNode;
      }

      // Render Layouts as Nested (wrapping inside-out)
      if (pageContextRef.value.config.nested) {
        // .reduce() replaces the mutating `forEach` loop.
        return layouts.reduce((childContent, LayoutComponent) => {
          // Vue 3 best practice: pass component children as a `default` slot function
          return h(LayoutComponent, null, { default: () => childContent });
        }, PageVNode);
      }

      // Wrap <Page> with a single <Layout>
      return h(layouts[0], null, { default: () => PageVNode });
    },
  };

  // Vue 3 best practice: use slots object for PageShell
  const RootComponent = () => h(PageShell, null, { default: () => h(PageWithLayout) });

  const app: App = ssr
    ? createSSRApp(RootComponent)
    : createVueApp(RootComponent);

  objectAssign(pageContext, { app });

  const { onCreateApp } = pageContext.config;
  await callCumulativeHooks(onCreateApp, pageContext);

  // Define it as a getter so it is always tied to the reactive shallowRef
  Object.defineProperty(app.config.globalProperties, '$pageContext', {
    get: () => pageContextRef.value,
  });

  // Note: Assuming setPageContext and setData are imported globally or elsewhere,
  // as they were missing from your original imports list.
  setPageContext(app, pageContextRef);
  setData(app, dataRef);

  // changePage() is called upon client-side navigation
  const changePage: ChangePage = async (newPageContext: PageContext) => {
    let returned = false;
    let err: unknown;

    app.config.errorHandler = (err_) => {
      if (returned) {
        console.error(err_);
      } else {
        err = err_;
      }
    };

    const data = newPageContext.data ?? {};
    assertDataIsObject(data);

    // Batch reactivity updates cleanly
    dataRef.value = data;
    pageContextRef.value = newPageContext;
    pageRef.value = newPageContext.Page;
    layoutRef.value = normalizeLayouts(newPageContext.config.Layout);

    useUnhead(newPageContext);

    await nextTick();
    returned = true;

    if (err) throw err;
  };

  return { app, changePage };
}
