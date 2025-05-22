// https://vike.dev/usePageContext
export {
  usePageContext,
  setPageContext,
  useData,
  setData,
};

import { inject } from "vue";
import type { App, InjectionKey, Ref } from "vue";
import type { PageContext } from "vike/types";
import { ShallowReactive } from "vue";

const key: InjectionKey<Ref<PageContext>> = Symbol();
const key_: InjectionKey<Ref<unknown>> = Symbol();

/** https://vike.dev/usePageContext */
function usePageContext(): Ref<PageContext> {
  const pageContext = inject(key);
  if (!pageContext) throw new Error("setPageContext() not called in parent");
  return pageContext;
}

function setPageContext(app: App, pageContext: Ref<PageContext>): void {
  app.provide(key, pageContext);
}

/** https://vike.dev/useData */
function useData<Data>(): ShallowReactive<Data> {
  // const data = computed(() => usePageContext().value.data as Data);
  // return data;
  const data = inject<ShallowReactive<Data>>(key_)!
  return data
}

function setData(app: App, data: Ref<unknown>): void {
  app.provide(key_, data)
}