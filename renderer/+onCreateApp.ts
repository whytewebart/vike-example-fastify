export { onCreateApp };

import PrimeVue from 'primevue/config';

import { ConfirmationService, Ripple, ToastService, Tooltip } from 'primevue';
import { createPinia } from "pinia";
import { usePt } from './styles/primevue/preset';

import "virtual:uno.css";

const onCreateApp = async (pageContext: PageContextWithApp) => {
  const { app } = pageContext;
  // INSTANTIATE PINIA
  const pinia = createPinia()
  // Add the UI plugin
  app.use(PrimeVue, {
    ripple: true,
    unstyled: true,

    // pt: await usePt(['button', 'progressbar', 'select', 'dialog']),
    pt: await usePt(),
    ptOptions: {
      mergeProps: true,
      // mergeSections: false,
    }
  });

  app.use(ConfirmationService)
  app.use(ToastService)



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
