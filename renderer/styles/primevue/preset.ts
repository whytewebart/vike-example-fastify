// src/utils/primevue-preset.ts
import type { PrimeVuePTOptions } from 'primevue/config';

type PresetImport = Record<string, () => Promise<any>>;
const usedComponents = reactive(new Set<string>());

export async function loadPrimeVuePreset(
    componentName: string, returnPreset: boolean = true
) {
    const name = componentName.toLowerCase();
    usedComponents.add(name);

    let preset = {};

    if (returnPreset) {
        const presets = <PresetImport>import.meta.glob('./aura/**/*.js');

        for (const path in presets) {
            if (path.toLowerCase().includes(name)) {
                const mod = await presets[path]();
                preset = mod.default || {};
                break;
            }
        }
    }

    if (Object.keys(preset).length === 0) {
        console.warn(`[PrimeVue] No Tailwind preset found for ${componentName}`);
    }

    return preset;
}

export async function loadMultiplePrimeVuePresets(
    componentNames: string[]
): Promise<Record<string, any>> {
    const presets = <PresetImport>import.meta.glob('./aura/**/*.js');
    const result: Record<string, any> = {};

    for (const componentName of componentNames) {
        const name = componentName.toLowerCase();
        let preset = {};

        for (const path in presets) {
            if (path.toLowerCase().includes(name)) {
                const mod = await presets[path]();
                preset = mod.default || {};
                break;
            }
        }

        if (Object.keys(preset).length === 0) {
            console.warn(`[PrimeVue] No Tailwind preset found for ${componentName}`);
        }

        result[name] = preset;
    }

    return result;
}

export async function usePt(componentNames: string[]): Promise<PrimeVuePTOptions> {
    const globalStyles = import('./aura/global.js');
    const directives = {
        badge: (await import('./aura/badgedirective/index.js')).default,
        ripple: (await import('./aura/ripple/index.js')).default,
        tooltip: (await import('./aura/tooltip/index.js')).default,
    };

    const preset: PrimeVuePTOptions = {
        directives
    };

    // Load global styles first
    const global = await globalStyles;
    preset.global = global.default;

    // Load only used component presets
    const result = await loadMultiplePrimeVuePresets(componentNames);

    return {
        ...preset,
        ...result
    };
}
