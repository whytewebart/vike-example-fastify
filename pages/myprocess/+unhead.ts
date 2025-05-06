import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        title: 'Process – My Development Approach',
        meta: [
            { name: 'description', content: 'Clear steps I follow to deliver reliable, refined results — from first contact to final polish. I design and build long-lasting digital products — from full-stack apps to brand visuals. Simple, polished, and made to last.' },
            { property: 'og:title', content: 'Process – My Development Approach' },
            { property: 'og:description', content: 'Clear steps I follow to deliver reliable, refined results — from first contact to final polish. I design and build long-lasting digital products — from full-stack apps to brand visuals. Simple, polished, and made to last.' }
        ]
    }
}