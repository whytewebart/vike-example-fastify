// primevue-tailwind-resolver.ts
import { components, directives } from "@primevue/metadata";
import type { ComponentResolver } from "unplugin-vue-components";
import { loadPrimeVuePreset } from "./preset";

interface PrimeVueTailwindResolverOptions {
  components?: {
    prefix?: string;
  };
  directives?: {
    prefix?: string;
  };
}

function PrimeVueTailwindResolver(options: PrimeVueTailwindResolverOptions = {}): ComponentResolver[] {

  return [
    {
      type: "component",
      resolve: async (name) => {
        const { prefix } = options.components || {};
        const baseName = getName(name, prefix);
        
        if (!baseName) return;

        const componentMeta = components.find(c => 
          c.name?.toLowerCase() === baseName.toLowerCase()
        );

        if (componentMeta && componentMeta.from) {
          await loadPrimeVuePreset(baseName, false)
          return {
            from: componentMeta.from,
            // sideEffects: `${presetPath}/${baseName.toLowerCase()}/index.js`,
          };
        }
      }
    },
    {
      type: "directive",
      resolve: (name) => {
        const { prefix } = options.directives || {};
        const baseName = getName(name, prefix);
        
        if (!baseName) return;

        const directiveMeta = directives.find(d => 
          d.name?.toLowerCase() === baseName.toLowerCase()
        );

        if (directiveMeta && directiveMeta.from && directiveMeta.as) {
          return {
            from: directiveMeta.from,
            as: directiveMeta.as
          };
        }
      }
    }
  ];
}

function getName(name: string, prefix?: string): string | undefined {
  if (prefix && name.startsWith(prefix)) {
    return name.substring(prefix.length);
  }
  return name;
}

export { PrimeVueTailwindResolver };