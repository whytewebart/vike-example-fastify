import type { App } from "vue";
export default {
    install(app: App) {

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
    },
};

declare module "vue" {
    interface ComponentCustomProperties {

    }
}