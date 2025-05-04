import { Config } from "vike/types";

export default {
    meta: {
        clients: {
            env: {
                server: true,
                client: true,
            }
        },
    },

    unhead: {
        title: "Emmanuel",
        meta: [
            // {
            //     name: "theme-color",
            //     content: "#FBFBFB"
            // }
        ]
    }
} satisfies Config