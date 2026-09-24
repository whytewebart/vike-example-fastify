import {
	renderToString as vueRenderToString,
	renderToWebStream,
	renderToSimpleStream,
} from "@vue/server-renderer";
import type { App } from "vue";
import type { Readable } from "node:stream";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "vike/types";
import { parse } from "node-html-parser";

import { createApp } from "./app";
import { callCumulativeHooks } from "./utils";
import { useUnhead } from "./plugins/unhead";

export const onRenderHtml = async (pageContext: PageContextServer) => {
	// 1. Initialize Vue application instance
	const { app } = await createApp(pageContext, !!pageContext.Page);

	// 2. Execute custom lifecycle hooks before rendering
	const { onAfterRenderHtml, stream: _stream } = pageContext.config;
	await callCumulativeHooks(onAfterRenderHtml, pageContext);

	// 3. Prepare template skeleton and resolve head tags via Unhead
	var documentHtml: ReturnType<typeof escapeInject>;
	const marker = "<!--- html --->";
	const skeleton = /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head></head>
      <body>${marker}</body>
    </html>
  `;

	const { render: renderHead } = useUnhead(pageContext);
	const headFrame = await renderHead(skeleton);
	const [before, after] = headFrame.split(marker);
	const stream = Array.isArray(_stream) ? _stream : [_stream];

	// 4. Render App Content (Handles String vs Stream modes)
	let html: string | Readable | ReadableStream;

	if (!stream[0]) {
		// String Mode: Render full string asynchronously
		html = await renderAppToString(app, pageContext);
	} else if (stream[0] === "web") {
		// Web ReadableStream Mode
		html = renderToWebStream(app, pageContext);
	} else {
		// Simple Stream Mode: Promisify/wrap into Web ReadableStream to avoid race conditions
		html = new ReadableStream({
			start(controller) {
				renderToSimpleStream(app, pageContext, {
					push(chunk) {
						if (chunk === null) {
							controller.close();
						} else {
							controller.enqueue(new TextEncoder().encode(chunk));
						}
					},
					destroy(err) {
						controller.error(err);
					},
				});
			},
		});
	}

	// 5. Collect Vue Teleports (e.g., modals, tooltips targeted to <body> or custom selectors)
	if (!stream[0]) {
		// Preserve comment nodes required for Vue client hydration
		const root = parse(html.toString(), { comment: true });
		const teleports = pageContext?.teleports ?? {};

		for (const [selector, teleportHtml] of Object.entries(teleports)) {
			const target = root.querySelector(selector);
			if (target) {
				target.insertAdjacentHTML("beforeend", teleportHtml);
			}
		}

		html = root.toString();
		documentHtml = escapeInject`${dangerouslySkipEscape(
			`${before}${html}${after}`,
		)}`;
	} else {
		// 6. Assemble the final document HTML using Vike's escapeInject
		documentHtml = escapeInject`${dangerouslySkipEscape(before)}${html}${dangerouslySkipEscape(after)}`;
	}

	return {
		documentHtml,
		pageContext: {
			enableEagerStreaming: stream !== undefined,
		},
	};
};

/**
 * Renders Vue app to string while preventing Vue production error-swallowing bug.
 * @see https://github.com/vuejs/core/issues/7876
 */
async function renderAppToString(
	app: App,
	ssrContext: PageContextServer,
): Promise<string> {
	let renderError: unknown;

	app.config.errorHandler = (err) => {
		renderError = err;
	};

	const appHtml = await vueRenderToString(app, ssrContext);

	if (renderError) {
		throw renderError;
	}

	return appHtml;
}

declare global {
	namespace Vike {
		interface PageContext {
			teleports?: Record<string, string>;
		}
	}
}
