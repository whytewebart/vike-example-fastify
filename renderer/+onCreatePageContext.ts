import { createPinia, Pinia, StateTree } from "pinia";
import { createHead } from "@unhead/vue/server";
import { createHead as createHeadClient } from "@unhead/vue/client";
import type { PageContext, PageContextServer } from 'vike/types'
import { CanonicalPlugin } from 'unhead/plugins'

export async function onCreatePageContext(pageContext: PageContext) {
  const headOpts: Parameters<typeof createHead>[0] = {
    plugins: [
      CanonicalPlugin({
        canonicalHost: pageContext.urlParsed.hostname ?? window.location.hostname
      })
    ]
  }
  pageContext.store = createPinia();

  if (import.meta.env.SSR) {
    pageContext.unhead = createHead(headOpts)
  }

  if (!import.meta.env.SSR) {
    pageContext.unhead = createHeadClient(headOpts)
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      store?: Pinia;
      unhead: ReturnType<typeof createHead>;
    }

    interface GlobalContext {
      store?: Pinia
    }

    type UnheadInput = ReturnType<Vike.PageContext['unhead']['push']>;
    type meta = UnheadInput | ((pageContext: PageContext) => UnheadInput);
  }
}