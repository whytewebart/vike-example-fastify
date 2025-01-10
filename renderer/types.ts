export type { Component };

// import { InferSeoMetaPluginOptions } from "@unhead/addons";
import { FastifyReply } from "fastify/types/reply";
// import { Pinia } from "pinia";
// import { type UseHeadInput, createHead } from "unhead";
import { PageContext, PageContextClient, PageContextServer } from "vike/types";
import type { ComponentPublicInstance, App } from "vue";
import { UseHeadInput } from "unhead";

type Component = ComponentPublicInstance; // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Page = Component;

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      // @ts-ignore
      Page: Page;
      /** https://vike.dev/render */
      abortReason?: string;
      pageProps: any;
      app?: App;

      data?: {
        /** Value for <title> defined dynamically by by /pages/some-page/+data.js */
        title?: string;
        description?: string;
        unhead?: UseHeadInput<any>;
      };

      config: {
        /** Value for <title> defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string;
        /** Value for <meta name="description"> defined statically */
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
