import { PageContext } from "vike/types"
import ogImage from "assets/og-image.webp"

export { unhead }



const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    const _processImages = import.meta.glob('assets/process/*.webp', {
        eager: true,
        import: "default",
        // query: "?extractExportNames",
    })

    const processImages = Object.values(_processImages) as string[]

    var { origin, pathname } = new URL(pageContext.urlFullRoute);
    const url = origin + pageContext.urlOriginal

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
        ],

        // link: processImages.map(imagestring => ({
        //     rel: 'preload',
        //     as: 'image',
        //     href: imagestring
        // })),

        link: [
            {
                rel: "preconnect",
                href: "https://www.googletagmanager.com"
            },
            {
                rel: "preload",
                href: "https://www.googletagmanager.com/gtag/js?id=G-WG2PHLTVVJ",
                as: "script"
            }
        ],

        script: [
            {
                async: true,
                src: "https://www.googletagmanager.com/gtag/js?id=G-WG2PHLTVVJ",
            },
            {
                innerHTML: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-WG2PHLTVVJ');`,
            }
        ]
    }
}