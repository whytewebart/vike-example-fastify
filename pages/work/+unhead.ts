import { PageContext } from "vike/types"
export { unhead }

const unhead = (pageContext: PageContext): Vike.Config['unhead'] => {
    var { origin } = new URL(pageContext.urlFullRoute);

    return {
        title: 'Work – Clients & Projects',
        meta: [
            { name: 'description', content: "A selection of client and personal projects · I'm a freelance Freelance Full-Stack Developer & Brand Designer with 5+ years of experience crafting interactive projects on the web. I design and build long-lasting digital products — Simple, polished, and made to last." },
            { property: 'og:title', content: 'Work – Clients & Projects' },
            { property: 'og:description', content: "A selection of client and personal projects · I'm a freelance Freelance Full-Stack Developer & Brand Designer with 5+ years of experience crafting interactive projects on the web. I design and build long-lasting digital products — Simple, polished, and made to last." }
        ]
    }
}