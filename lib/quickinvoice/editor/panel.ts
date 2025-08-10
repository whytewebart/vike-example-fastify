import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import { MinzeElement } from 'minze'

export interface EditorPanel {
    panelStatus: 'open' | 'closed'
}

export class EditorPanel extends MinzeElement {

    reactive?: Reactive = [
        ['panelStatus', 'open']
    ]

    beforeRender() {
        // @ts-ignore
        this.panelStatus = this.getAttribute('panel-status') || this.panelStatus
    }

    watch: Watch = [
        ['panelStatus', (newValue, oldValue, key, target) => {
            if (newValue === 'open') {
                useGsap(({ gsap }) => {
                    const el = this.select('[section=panel-content]')
                    gsap.to(el, { height: 'auto' });
                });

                return
            }

            useGsap(({ gsap }) => {
                const el = this.select('[section=panel-content]')
                gsap.to(el, { height: 0, overflow: 'clip' });
            });
        }]
    ]

    header = () => /*html*/`
        <div part="header" class="shadow">
            <p class="font-space-mono font-semibold">${this.title}</p>
            <button class="flex p-2 rounded transition mr-2" hover="bg-gray-50" focus="bg-gray-100">
                <span class="i-solar-alt-arrow-down-outline text-xl ${this.panelStatus === 'closed' ? 'rotate-180' : ''}"></span>
            </button>
        </div>
    `

    html = () => /*html*/`
        <div part="root">
            ${this.header()}
            <div section="panel-content" part="content">
                <slot></slot>
            </div>
        </div>
    `

    css = () => /*css*/`
        @unocss-placeholder

        [part="header"] {
            --un-bg-opacity: 1;
            padding-left: 1rem;
            padding-top: 0.2rem;
            padding-bottom: 0.2rem;
            background-color: rgb(255 255 255 / var(--un-bg-opacity)) /* #fff */;
            border-bottom-width: 1px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            position: sticky;
            z-index: 2;
            top: 0;
        }

        [part="header"] p {
            font-family: "Space Mono";
            font-weight: 600; 
        }
    `

    eventListeners?: EventListeners = [
        [
            '[part=header] button', 'click', (e) => {
                this.panelStatus = this.panelStatus === 'open' ? 'closed' : 'open';
            }
        ]
    ]
}