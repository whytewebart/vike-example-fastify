import { createPinia, Pinia, StateTree } from "pinia";
import type { PageContextServer } from 'vike/types'
 
export async function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.store = createPinia();
}
 
declare global {
  namespace Vike {
    interface PageContext {
      store?: Pinia;
    }

    interface GlobalContext {
      store?: Pinia
    }
  }
}