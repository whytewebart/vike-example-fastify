// https://vike.dev/usePageContext
export {
  useGsap,
  useGsapPlugins,
  useAnimateCtx,
  useGsapTimeline,
  elementKey,
  useBreakoutDefaults
};

import { inject } from "vue";
import type { ComponentCustomProperties } from "vue";

interface BreakoutDefaultsEvent {
  type: 'viewport.clear' | 'viewport.set'; // Define event types more strictly
  payload?: string; // Payload for 'viewport.set'
}

function useBreakoutDefaults() {
  // Use a more descriptive initial value or null if it's truly optional
  const viewport = ref<string>(''); // Initialize with an empty string
  const bus = useEventBus<BreakoutDefaultsEvent>("breakout-defaults");

  // Use watchEffect or a direct watch if you need more control over dependencies
  // For simple side effects from bus events, a direct watch on a computed property
  // or a more structured approach might be considered if complexity grows.
  bus.on((event) => {
    switch (event.type) {
      case 'viewport.clear':
        viewport.value = '';
        break;
      case 'viewport.set':
        // console.log(event.payload); // Only log the payload for better clarity
        // Ensure payload exists and is a string before assigning
        if (typeof event.payload === 'string') {
          viewport.value = event.payload;
        } else {
          console.warn("Received 'viewport.set' event without a valid string payload.");
        }
        break;
      default:
        // Handle unknown event types or log a warning
        console.warn(`Unknown event type received: ${event.type}`);
    }
  });

  // Direct setter for viewport is clearer and avoids string magic for simple updates
  const setViewport = (payload: string) => {
    viewport.value = payload;
  };

  // Renamed to `emitEvent` to avoid conflict with a common property name and
  // to be more explicit about its purpose.
  // The payload type should be defined by the event type.
  const emitEvent = (type: BreakoutDefaultsEvent['type'], payload?: string) => {
    // Ensure the payload matches the expected type for 'viewport.set'
    if (type === 'viewport.set' && typeof payload !== 'string') {
      console.error("Payload is required for 'viewport.set' event and must be a string.");
      return;
    }
    bus.emit({ type, payload });
  };

  // Optional: Add a function to clear the viewport explicitly
  const clearViewport = () => {
    viewport.value = '';
    // Optionally emit an event for this specific action if other parts of the app need to react
    // emitEvent('viewport.clear');
  };

  return {
    viewport,
    setViewport, // Direct setter for internal or immediate updates
    emitEvent,    // For broadcasting updates via event bus
    // clearViewport, // Expose if needed externally
  };
}

function useGsap() {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found")

  return gsap
}

function useGsapPlugins() {
  const gsapPlugins = inject<ComponentCustomProperties['$gsapPlugins']>("$gsapPlugins")
  if (!gsapPlugins) throw new Error("gsap plugins not found")

  return gsapPlugins
}

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
  return `[data-animate="${key_}"]` as const;
};

const useGsapTimeline: useGsapTimeline = (keys, opts, callback) => {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found");

  const elements = Object.fromEntries(keys.map(key => [key, elementKey(key)]));
  const timeline = gsap.timeline(opts);

  onMounted(() => {
    // @ts-ignore
    callback({ timeline, gsap, elements });
  })
};

const useAnimateCtx = (callback: (animateContext: AnimateContext) => void) => {
  const gsap = inject<GSAP>("$gsap")
  if (!gsap) throw new Error("gsap not found");

  const { fromvars, setFromVars: _setFromVars } = inject<any>("gsap-styles-context");
  // Set the initial values for the animation
  const setFromVars = (key: string, values: gsap.TweenVars) => {
    var element = elementKey(key); _setFromVars(key, values);
    // Set the initial style on the element
    onMounted(() => { gsap.set(element, values) })
  }

  const animateContext = {
    gsap,
    setFromVars,
    key: elementKey,
    fromvars,
  }

  callback(animateContext)
  return animateContext
}