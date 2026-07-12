// https://vike.dev/onRenderHtml
export { onRenderHtml };

import {
	renderToString as renderToString_,
	renderToNodeStream,
	renderToWebStream,
	renderToSimpleStream,
} from "@vue/server-renderer";
import type { App } from "vue";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "vike/types";
import { createApp } from "./app";
import { callCumulativeHooks } from "./utils";
import { useUnhead } from "./plugins/unhead";
import Stream from "stream";

const onRenderHtml = async (pageContext: PageContextServer) => {
	const { app } = await createApp(pageContext, !!pageContext.Page);
	const appHtml = await renderToString(app, pageContext);
	const { render } = useUnhead(pageContext);

	const { onAfterRenderHtml, stream } = pageContext.config;
	await callCumulativeHooks(onAfterRenderHtml, pageContext);

	const marker = "<!--- html --->";
	const skeleton = /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head></head>
      <body>${marker}</body>
    </html>
  `;

	const frame = await render(skeleton);
	const [before, after] = frame.split(marker);
	var html: string | Stream.Readable | ReadableStream = '';

	if (!stream) html = await render(appHtml);
	else if (stream === "node") html = renderToNodeStream(app, pageContext);
	else if (stream === "web") html = renderToWebStream(app, pageContext);
	else if (stream)
		renderToSimpleStream(app, pageContext, {
			push(chunk) {
				if (chunk === null) {
					// done
					console.log(`[render complete]`);
				} else {
					if (!html) html = '';
					html += chunk;
					console.log(`[chunk] ${chunk}`)
				}
			},
			destroy(err) {
				// error encountered
			},
		});

	const documentHtml = escapeInject`${dangerouslySkipEscape(
		`${before}${html}${after}`,
	)}`;

	return {
		documentHtml,
		pageContext: {
			enableEagerStreaming: stream !== undefined,
		},
	};
};

async function renderToString(app: App, context: any) {
	let err: unknown;
	// Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
	app.config.errorHandler = (err_) => {
		err = err_;
	};
	const appHtml = await renderToString_(app, context);
	if (err) throw err;
	return appHtml;
}
