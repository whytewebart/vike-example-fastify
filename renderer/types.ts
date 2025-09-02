export type { Component };

// import { InferSeoMetaPluginOptions } from "@unhead/addons";
import { PageContext, PageContextClient, PageContextServer } from "vike/types";
import type { ComponentPublicInstance, App } from "vue";
import { UseHeadInput } from "unhead";
import { Pinia, StateTree } from "pinia";

type Component = ComponentPublicInstance; // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Page = Component;

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      // @ts-ignore
      Page: Page;
      abortReason?: string;
      pageProps: any;
      app?: App;

      data?: {
        title?: string;
        description?: string;
        unhead?: UseHeadInput<any>;
      };

      config: {
        title?: string;
        description?: string;
      };
    }

    interface Config {
      nested?: boolean;
      middleware?: ((pageContext: PageContext) => Promise<void>)[];
      Layout?: Page | Page[];
      ssr?: boolean;
      onCreateApp?: Array<
        (
          pageContext: PageContextWithApp
        ) => void | ((pageContext: PageContextWithApp) => Promise<void>)
      >;
      onAfterRenderHtml?: Array<
        (
          pageContext: PageContextServer
        ) => void | ((pageContext: PageContextServer) => Promise<void>)
      >;
      ssrSlot?: string;
      unhead?:
        | UseHeadInput<any>
        | ((pageContext: PageContext) => UseHeadInput<any>);
      secrets?: Record<string, string>;
    }
  }

  type UnheadInput = UseHeadInput<any>;
  type ReturnContext = Vike.PageContext["data"] & {
    [key: string]: any;
  };
  type MiddlewareAsync = (pageContext: PageContextClient) => Promise<void>;
  type PageContextWithApp = PageContext & {
    app: NonNullable<PageContext["app"]>;
  };
}
