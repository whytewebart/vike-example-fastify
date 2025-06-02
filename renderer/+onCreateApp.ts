export { onCreateApp };

// import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';

import { Ripple, Tooltip } from 'primevue';
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

  app.directive("tooltip", Tooltip);
  app.directive('ripple', Ripple);
  app.directive("animate-key", {
    getSSRProps(binding, vnode) {
      if (!binding.arg) {
        console.warn("gsap directive must have an argument of a string");
        return {};
      }

      return {
        'data-animate': binding.arg
      }
    },

    mounted(el, binding, vnode) {
      const element: HTMLElement = el;
      element.setAttribute("data-animate", binding.arg || '');
    }
  });
};
