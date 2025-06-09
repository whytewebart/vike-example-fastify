import modules, { defineAll } from "@/renderer/plugins/minze";
import { OnHydrationEndSync } from "vike/types";

export { onHydrationEnd };

const onHydrationEnd: OnHydrationEndSync =
    (pageContext): ReturnType<OnHydrationEndSync> => {
        defineAll(modules)
    }