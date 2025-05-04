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
        title: "Emmanuel - Whyte WebArt",
        meta: [
            // {
            //     name: "theme-color",
            //     content: "#FBFBFB"
            // }
        ]
    },

    clients: []
} satisfies Config