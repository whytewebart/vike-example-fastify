// https://vike.dev/usePageContext
export {
  usePageContext,
  setPageContext,
  useData,
  setData,
  useGsap,
  useGsapPlugins,
  useAnimateCtx,
  useGsapTimeline,
  elementKey
};

import { inject } from "vue";
import type { App, ComponentCustomProperties, InjectionKey, Ref } from "vue";
import type { PageContext } from "vike/types";
import { ShallowReactive } from "vue";
import type { ParseOptions } from "css-tree";
import * as csstree from "css-tree";

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

function useGsap() {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found")

  return gsap
}

function useGsapPlugins() {
  const gsapPlugins = inject<ComponentCustomProperties['$gsapPlugins']>("$gsapPlugins")
  if (!gsapPlugins) throw new Error("gsap plugins not found")

  return gsapPlugins
}

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
  return `[data-animate="${key_}"]` as const;
};

const useGsapTimeline: useGsapTimeline = (keys, opts, callback) => {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found");
  
  const elements = Object.fromEntries(keys.map(key => [key, elementKey(key)]));
  const timeline = gsap.timeline(opts);

  onMounted(() => {
    // @ts-ignore
    callback({ timeline, gsap, elements });
  })
};

const useAnimateCtx = (callback: (animateContext: AnimateContext) => void) => {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found");

  const { fromvars, setFromVars: _setFromVars } = inject<any>("gsap-styles-context");
  // Set the initial values for the animation
  const setFromVars = (key: string, values: gsap.TweenVars) => {
    var element = elementKey(key); _setFromVars(key, values);
    // Set the initial style on the element
    onMounted(() => { gsap.set(element, values) })
  }

  const animateContext = {
    gsap,
    setFromVars,
    key: elementKey,
    fromvars,
  }

  callback(animateContext)
  return animateContext
}