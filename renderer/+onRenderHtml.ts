// https://vike.dev/onRenderHtml
export { onRenderHtml };

import { renderToString as renderToString_ } from "@vue/server-renderer";
import type { App } from "vue";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { createApp } from "./app";

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  // if (!pageContext.Page) throw new Error('My render() hook expects pageContext.Page to be defined')

  const { app, head } =
    await createApp(pageContext, !!pageContext.Page);
  const appHtml = await renderToString(app);

  const {
    headTags,
    bodyAttrs,
    htmlAttrs,
    bodyTags,
    bodyTagsOpen
  } = head;

  const documentHtml = escapeInject/*html*/ `<!DOCTYPE html>
    <html ${dangerouslySkipEscape(htmlAttrs)}>
      <head>
        ${dangerouslySkipEscape(headTags)}
      </head>
      <body ${dangerouslySkipEscape(bodyAttrs)}>
       ${dangerouslySkipEscape(bodyTagsOpen)}
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
         ${dangerouslySkipEscape(bodyTags)}
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    },
  };
};

async function renderToString(app: App) {
  let err: unknown;
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_;
  };
  const appHtml = await renderToString_(app);
  if (err) throw err;
  return appHtml;
}
