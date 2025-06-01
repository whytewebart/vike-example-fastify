export { onCreateApp };

// import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import gsap from "./plugins/gsap";

import { Ripple, Tooltip } from 'primevue';
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from "pinia"; 
import { usePt } from './styles/primevue/preset';

import "virtual:uno.css";
import "./styles/main.scss";

const onCreateApp = async (pageContext: PageContextWithApp) => {
  const { app } = pageContext;
  // Add the UI plugin
  app.use(PrimeVue, {
    // theme: {
    //   preset: Aura,
    //   options: {
    //     prefix: "p",
    //     darkModeSelector: "dark",
    //     cssLayer: false,
    //   },
    // },

    ripple: true,
    unstyled: true,

    pt: await usePt(['button', 'progressbar']),
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
