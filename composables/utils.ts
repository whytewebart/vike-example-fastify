// https://vike.dev/usePageContext
export {
  elementKey,
};

import { inject } from "vue";
import type { ComponentCustomProperties } from "vue";

const elementKey = <T extends string>(key_: T): DataAnimateSelector<T> => {
  return `[data-animate="${key_}"]` as const;
};