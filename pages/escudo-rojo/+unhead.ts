import ogImage from "./assets/social-preview.webp"
import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {

    var { origin } = new URL(pageContext.urlFullRoute);
    return {
        link: [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "" },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap'
            }
        ],
        meta: [
            {
                name: "theme-color",
                content: "#D32F2F"
            },
            { property: 'og:type', content: 'website' },
            { property: 'og:image', content: `${origin}${ogImage}` },
            { property: 'og:image:type', content: 'image/webp' },
            { name: 'robots', content: 'index, follow' },
            {
                name: "description",
                content: "Discover Escudo Rojo, Baron Philippe de Rothschild's exquisite Chilean wines. Experience the perfect blend of Bordeaux winemaking tradition and exceptional Chilean terroir. Explore our premium red & white wines."
            },
            { property: 'og:title', content: "Escudo Rojo | Premium Chilean Wines with Bordeaux Heritage" },
            { property: 'og:description', content: "Discover Escudo Rojo, Baron Philippe de Rothschild's exquisite Chilean wines. Experience the perfect blend of Bordeaux winemaking tradition and exceptional Chilean terroir. Explore our premium red & white wines." },
        ],

        title: "Escudo Rojo | Premium Chilean Wines with Bordeaux Heritage"
    }
}
