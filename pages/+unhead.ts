import { PageContext } from "vike/types"
import ogImage from "assets/og-image.webp"

export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin, pathname } = new URL(pageContext.urlFullRoute);
    const url = origin+pageContext.urlOriginal

    return {
        meta: [
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: url },
            { property: 'og:image', content: `${origin}${ogImage}` },
            { property: 'twitter:card', content: 'summary_large_image' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:type', content: 'image/png' },
            { name: 'robots', content: 'index, follow' },
            {
                name: 'theme-color',
                // content: "#F6FAFE"
                content: "#FBFDFF"
            }
        ]
    }
}