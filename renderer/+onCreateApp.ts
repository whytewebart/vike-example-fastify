export { onCreateApp };

import "virtual:uno.css";
import "./styles/main.css";

// PINIA
import persist from "@plugins/pinia/persist";
import { serialize } from "@plugins/pinia/utils";

const onCreateApp = async (pageContext: PageContextWithApp) => {
	const { app } = pageContext;
	if (!app) return;
	if (pageContext.isClientSide) {
		// Add the UI plugin
	}

	// Setup SEO / UnHead
	app.use(pageContext.unhead);

	// Initialize Pinia store
	pageContext.store?.use(persist.plugin());

	if (pageContext.isHydration) {
		const { _piniaInitialState: state } = pageContext;
		if (state) pageContext.store!.state.value = serialize(state);
		pageContext.globalContext.store = pageContext.store;
	}

	app.use(pageContext.globalContext.store ?? pageContext.store!);
};
