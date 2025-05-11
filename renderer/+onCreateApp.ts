export { onCreateApp };

import AuraTailwind from "./styles/primevue/aura";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { Ripple, Tooltip } from 'primevue';
import { MotionPlugin } from '@vueuse/motion'


import "virtual:uno.css";
import "./styles/main.scss";
import gsap from "./plugins/gsap";
import { createPinia } from "pinia";
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

  const pinia = createPinia()
  
  app.use(pinia)
  app.use(MotionPlugin)
  app.use(gsap)

  app.directive("tooltip", Tooltip);
  app.directive('ripple', Ripple);
};
