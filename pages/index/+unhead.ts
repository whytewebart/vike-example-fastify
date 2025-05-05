import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {

    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        title: 'Emmanuel – Freelance Full-Stack Developer & Brand Designer',
        meta: [
            { name: 'description', content: 'I design and build long-lasting digital products — from full-stack apps to brand visuals. Simple, polished, and made to last.' },
            { name: 'robots', content: 'index, follow' },
            { name: 'author', content: 'Emmanuel' },
            { property: 'og:title', content: 'Emmanuel – Freelance Full-Stack Developer & Brand Designer' },
            { property: 'og:description', content: 'Simple, polished, and lasting solutions for mobile, web, backend, and brand design.' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: origin },
        ]
    }
}