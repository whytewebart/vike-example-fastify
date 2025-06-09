import { Attrs, EventListeners, MinzeElement } from 'minze'
import { nanoid } from "nanoid"

export interface CustomLink {
    href: string
    target: string
}

export class CustomLink extends MinzeElement {
    debug = true
    options = { cssReset: false }
    attrs: Attrs = ['href', 'target']
    static observedAttributes = ['href', 'target']

    hostcss = `inline-block invisible`

    onStart() {
        this.role = 'link'
        this.tabIndex = 0;

        if (!this.dataset.animate)
            this.setAttribute('data-animate', nanoid(6));

        // Reorder class list: hostcss first, then any user-defined classes
        const userClasses = this.getAttribute('class')?.split(/\s+/) ?? []
        const baseClasses = this.hostcss.split(/\s+/);

        // Remove all current classes
        this.className = ''

        // Apply in correct order
        this.classList.add(...baseClasses, ...userClasses)
    }

    afterRender() {

        useGsap(({ gsap, elementKey }) => {
            const el = elementKey(this.dataset.animate!);
            gsap.from(el, { opacity: 0, y: 20, autoAlpha: 0 });
        }, { plugins: ['ScrollTrigger'] });

    }

    onReactive() {
        this.title = this.href
    }

    html = () => `
        <div part="root-div">
            <p class="text-2xl font-semibold">
                <slot></slot>
            </p>
        </div>
    `

    css = () => `
    @unocss-placeholder
    :host {
      --at-apply: inline-block invisible;
    }

    :host(:hover) {
      cursor: pointer;
      text-decoration: underline;
    }
  `

    open = (event: Event & { [key: string]: any }) => {
        const keys = ['Enter', 'Spacebar', ' ']

        if ((this.href && event.type === 'click') || keys.includes(event.key)) {
            window.open(this.href, this.target ?? '_self')
        }
    }

    eventListeners: EventListeners = [
        [this, 'click', this.open],
        [this, 'keydown', this.open]
    ]
}