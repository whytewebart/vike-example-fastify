export { onCreateApp };

import "virtual:uno.css";
import "./styles/main.scss";
import { createPinia } from "pinia";
import persist from "~plugins/pinia/persist";
import { serialize } from "~plugins/pinia/utils";

const onCreateApp = (pageContext: PageContextWithApp) => {
  const { app } = pageContext;
  if (!app) return;
  // Add the UI plugin
  
  // Initialize Piia store
  const pinia = createPinia();
  pinia.use(persist.plugin());

  if (pageContext.isHydration) {
    const { _piniaInitialState } = pageContext;
    if(_piniaInitialState) pinia.state.value = serialize(_piniaInitialState);
    pageContext.globalContext.store = pinia
  }

  app.use(pageContext.globalContext.store ?? pageContext.store!);
};
