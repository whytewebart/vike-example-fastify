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
  objectReplace,
} from "./utils";
import { Component } from "./types";
import PageShell from "./PageShell.vue";

import unHeadPlugin from "./plugins/unhead";

type ChangePage = (pageContext: PageContext) => Promise<void>;
async function createApp(pageContext: PageContext, ssr: boolean = true) {
  const pageContextRef = shallowRef(pageContext);
  const dataRef = shallowRef(pageContext.data);

  const pageRef = shallowRef(pageContext.Page);
  const layoutRef = shallowRef<Component[]>(
    pageContext.config.Layout || ([] as any)
  );

  const PageWithLayout = {
    render() {
      if (!!layoutRef.value && layoutRef.value.length > 0) {
        // Render Layouts as Nested
        if (pageContextRef.value.config.nested) {
          let RootComp = () => h(pageRef.value);
          layoutRef.value.forEach((layout) => {
            const Comp = RootComp;
            RootComp = () => h(layout, null, Comp);
          });

          return RootComp();
        }

        // Wrap <Page> with <Layout>
        const app = h(
          layoutRef.value[0],
          {},
          { default: () => h(pageRef.value) }
        );

        return app;
      } else {
        return h(pageRef.value);
      }
    },
  };

  const RootComponent = () => h(PageShell, null, () => h(PageWithLayout));

  const app: App = ssr
    ? createSSRApp(RootComponent)
    : createVueApp(RootComponent);
  objectAssign(pageContext, { app });

  const { setup } = unHeadPlugin();
  const head = await setup(pageContextRef.value)["server"]();

  const { onCreateApp } = pageContext.config;
  await callCumulativeHooks(onCreateApp, pageContext);

  setPageContext(app, pageContextRef);
  setData(app, dataRef);
  // changePage() is called upon navigation, see +onRenderClient.ts
  const changePage: ChangePage = async (pageContext: PageContext) => {
    let returned = false;
    let err: unknown;
    app.config.errorHandler = (err_) => {
      if (returned) {
        console.error(err_);
      } else {
        err = err_;
      }
    };
    const data = pageContext.data ?? {};
    assertDataIsObject(data);
    dataRef.value = pageContext.data;
    pageContextRef.value = pageContext;
    pageRef.value = pageContext.Page;
    // @ts-ignore
    layoutRef.value = pageContext.config.Layout;
    setup(pageContextRef.value)["client"]();
    await nextTick();
    returned = true;
    if (err) throw err;
  };

  return { app, changePage, head };
}
