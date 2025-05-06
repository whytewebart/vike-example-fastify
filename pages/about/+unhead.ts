import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        title: 'About – Emmanuel | Full-Stack Dev & Brand Designer',
        meta: [
            { name: 'description', content: 'Learn more about my background, how I work, and the principles that guide each project.' },
            { property: 'og:title', content: 'About – Emmanuel | Full-Stack Dev & Brand Designer' },
            { property: 'og:description', content: 'Background, values, and development process of a cross-disciplinary freelance developer and designer.' },
            // { property: 'og:url', content: `${origin}/about` }
        ]
    }
}