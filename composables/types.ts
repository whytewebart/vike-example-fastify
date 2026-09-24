interface AnimateContext {
    gsap: GSAP;
    fromvars: Ref<Record<string, gsap.TweenVars>>;
    setFromVars: (key: string, values: gsap.TweenVars) => void;
    key: <T extends string>(key_: T) => DataAnimateSelector<T>
}

type useGsapTimeline =
    <const Keys extends readonly string[]>
        (
            keys: Keys,
            opts: gsap.TimelineVars | undefined,
            callback: (ctx: {
                timeline: gsap.core.Timeline;
                gsap: typeof gsap;
                elements: SelectorMap<Keys>;
            }) => void
        ) => void

type DataAnimateSelector<T extends string> = `[data-animate="${T}"]`;
type SelectorMap<Keys extends readonly string[]> = {
    [K in Keys[number]]: DataAnimateSelector<K>
};