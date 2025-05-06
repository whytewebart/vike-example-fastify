import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        title: 'Services – Software, Apps, Branding & Design',
        meta: [
            { name: 'description', content: 'Offering full-stack development, mobile apps, troubleshooting, brand design, and UI/UX support for digital projects.' },
            { property: 'og:title', content: 'Services – Software, Apps, Branding & Design' },
            { property: 'og:description', content: 'Explore the range of services — from code to identity design — tailored to support startups and businesses.' }
        ]
    }
}