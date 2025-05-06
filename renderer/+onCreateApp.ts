export { onCreateApp };

import AuraTailwind from "./styles/primevue/aura";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { Ripple, Tooltip } from 'primevue';

import "virtual:uno.css";
import "./styles/main.scss";
const onCreateApp = (pageContext: PageContextWithApp) => {
  const { app } = pageContext;
  // Add the UI plugin
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: "dark",
        cssLayer: false,
      },
    },

    ripple: true,
    unstyled: true,

    pt: AuraTailwind,
    ptOptions: {
      mergeProps: true,
      // mergeSections: false,
    }
  });

  app.directive("tooltip", Tooltip);
  app.directive('ripple', Ripple);
};
