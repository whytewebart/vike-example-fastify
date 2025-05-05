import { PageContext } from "vike/types"
import ogImage from "assets/og-image.png"

export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        meta: [
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: origin },
            { property: 'og:image', content: `${origin}${ogImage}` },
            { property: 'twitter:card', content: 'summary_large_image' },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:type', content: 'image/png' },
        ]
    }
}