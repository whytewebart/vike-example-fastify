import type { App } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";
import ScrollSmoother from "gsap/ScrollSmoother";
import SplitText from "gsap/SplitText";

import { parseObjectToStyle } from "./composables";

// @unocss-include

export default {
    install(app: App) {
        const plugins = {
            ScrollTrigger: ScrollTrigger,
            MorphSVGPlugin: MorphSVGPlugin,
            ScrollSmoother: ScrollSmoother,
            SplitText: SplitText,
        };

        gsap.registerPlugin(...Object.values(plugins));

        app.config.globalProperties.$gsap = gsap;
        app.config.globalProperties.$gsapPlugins = plugins;

        app.provide("$gsap", gsap);
        app.provide("$gsapPlugins", plugins);

        const fromVars = ref<InitialStyle>({});
        app.provide("gsap-styles-context", {
            fromVars,
            setFromVars: (key: string, values: gsap.TweenVars) => {
                const { string: cssString, style } = parseObjectToStyle(values);
                fromVars.value[key] = { style, cssString, value: values };
            }
        });

        app.directive("gsap", {
            getSSRProps(binding, vnode) {
                if (!binding.arg) {
                    console.warn("gsap directive must have an argument of a string");
                    return {};
                }
                const { fromVars } = inject<any>("gsap-styles-context")

                return {
                    style: fromVars.value[binding.arg]?.style,
                    'data-animate': binding.arg,
                    // class: 'invisible'
                }
            },

            mounted(el, binding, vnode) {
                const element: HTMLElement = el;
                element.setAttribute("data-animate", binding?.arg);
                // console.log(element.style)
                // element.classList.add("invisible");
            }
        });
    },
};

type InitialStyle = Record<string, {
    cssString: string, style: Record<string, any>, value: gsap.TweenVars
}>;

declare module "vue" {
    interface ComponentCustomProperties {
        $gsap: typeof gsap;
        $gsapPlugins: {
            ScrollTrigger: typeof ScrollTrigger;
            MorphSVGPlugin: typeof MorphSVGPlugin;
            ScrollSmoother: typeof ScrollSmoother;
            SplitText: typeof SplitText;
        };
    }
}