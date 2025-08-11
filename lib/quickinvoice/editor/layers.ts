import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { IndexedDBWrapper } from './component/utils/state';

export interface EditorLayers {
    layerStatus: 'open' | 'closed',
    structure: SessionComponents[],
    session?: IndexedDBWrapper<DB.Session>,
    space?: IndexedDBWrapper<DB.Space>
}

type SessionComponents = DB.Session & { [key: string]: any }
type IDBListener = Event & {
    detail: {
        store: "space" | "session";
        db: IndexedDBWrapper;
        [key: string]: any
    }
}

export class EditorLayers extends MinzeElement {
    DB_VERSION = 1;
    DB_NAME = 'quickinvoice';

    reactive?: Reactive = [
        ['layerStatus', 'closed'],
        ['structure', []],
        'session',
        'space',
    ]

    watch: Watch = [
        ['layerStatus', async (newValue, oldValue, key, target) => {
            if (newValue == 'open') {
                await this.setStructure();
            }

            useGsap(({ gsap }) => {
                const el = this.select('[part=root]')
                if (newValue === 'open') {

                    gsap.set(el, {
                        autoAlpha: 1,
                        onComplete: () => {
                            gsap.to(el,
                                {
                                    height: 'auto',
                                    duration: .4,
                                    onComplete: () => {
                                        gsap.set(el, { overflowY: 'auto', });
                                    }
                                }
                            );
                        }
                    })
                }

                else if (newValue === 'closed') {
                    gsap.to(el, {
                        height: '0px',
                        overflow: 'clip',
                        duration: .4,
                        onComplete: () => {
                            gsap.set(el, {
                                autoAlpha: 0,
                            })
                        }
                    });
                }
            });
        }]
    ]

    openDB() {
        ["session", "space"].forEach((storeName, index) => {
            // @ts-ignore
            if (!this[storeName])
                Minze.dispatch(`indexeddb:${storeName}:request`)
        })
    }

    html = () => /*html*/`
        <div part="root" style="height: 0px; overflow: clip; opacity: 0" class="app-scrollbar shadow- max-h-60">
            <div class="py-1.8 bg-white border-b sticky top-0 z-10">
                <p class="font-mono font-semibold text-base px-2">Layers</p>
            </div>
            <div section="panel-content" part="content" class="bg-gray-50">
                ${this.recursiveRender(this.structure)}
                ${
                    this.structure.length === 0 ? /*html*/`
                        <div class="py-3 text-center" grid="~ content-center">
                            <h3 class="font-space-mono font-bold">No Component in the canvas</h3>
                            <p class="text-sm">Drag from the components panel or select a template</p>
                        </div>
                    ` : ''
                }
            </div>
        </div>
    `

    // RECURSIVE RENDER px-3 px-6 px-9 px-12 px-15 px-18 px-21 px-24 px-27 px-30
    recursiveRender(components: SessionComponents[], layer: number = 1): string {
        return components
            .sort((a, b) => a.order - b.order)
            .map(comp =>
            /*html*/`
                <div part="component" id="${comp.id}" class="border-t first:border-0">
                    <div class="transition-all relative" flex="~ justify-between items-center" hover="bg-gray-50 cursor-pointer font-900 shadow-sm z-1 [&_>_p]:ml-3">
                        <p
                            class="transition-all font-mono text-sm px-${layer * 3} py-1.5 capitalize"
                            
                        >
                           ${comp.components ? '<span class="i-solar-paperclip-rounded-2-outline"></span>' : ''} ${comp.label || comp.type.replaceAll('-', ' ')}
                        </p>
                        ${comp.components && comp.components.length > 0 ? /*html*/`<button
                                class="flex p-2 rounded transition mr-2"
                                hover="bg-gray-50"
                                focus="bg-gray-100"
                                data-component-id="${comp.id}"
                            >
                                <span class="i-solar-alt-arrow-down-outline text-xl"></span>
                            </button>` : ''
                }
                    </div>
                    ${comp.components && comp.components.length > 0 ? `<div nested class="border-t">${this.recursiveRender(comp.components, layer + 1)}</div>` : ''}
                </div>
            `
            ).join('');
    }

    async recursiveFind(session: DB.Space, response: SessionComponents[]) {
        if (!(this.space && this.session)) return response;
        const results: SessionComponents[] = [];

        for (const comp of response) {
            // CHECK IF DROPZONES
            const dropzoneKeys = Object.entries(comp.dropzones);
            if (dropzoneKeys.length === 0) {
                results.push(comp);
                continue;
            }
            // IF DROPZONES, FIND NESTED COMPONENTS
            const nestedComponents: SessionComponents[] = [];
            // LOOP THROUGH DROPZONE KEYS
            // AND FIND COMPONENTS IN DROPZONE
            for (const [key, value] of dropzoneKeys) {
                // DEFINE QUERY
                const query = IDBKeyRange.only([session.id, value]);
                const found = await this.session.findByIndex("sessionId", query);
                const nested = await this.recursiveFind(session, found);
                nestedComponents.push(...nested);
            }
            // ASSIGN NESTED COMPONENTS
            // TO THE CURRENT COMPONENT
            comp.components = nestedComponents;
            results.push(comp);
        }

        return results;
    }

    async setStructure() {
        this.openDB();
        if (!(this.space && this.session)) return;
        // GET LAST SESSION
        const session = (await this.space.findByIndex('latest', "true"))[0];
        if (!session) return;

        // GET QUERY
        const query = IDBKeyRange.only([session.id, session.id])
        // GET TOP-LEVEL COMPONENTS
        await this.session.findByIndex("sessionId", query)
            .then(async response => {
                // ASSIGN TOP-LEVEL COMPONENTS
                this.structure = await this.recursiveFind(session, response);
                this.rerender()
            });
    }

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

        /* [part=content] {
            min-height: 400px;
        } */

        [part=root] {
            background-color: #fff;
            border-width: 1px;
        }
    `

    async onReady() {
        /* LISTEN TOGGLE */
        Minze.listen(`layers:${this.id}:toggle`, async () => {
            /* console.log('called layers', this.layerStatus) */
            if (this.layerStatus == 'closed') this.layerStatus = 'open'
            else { this.layerStatus = 'closed' }
        });
    }

    eventListeners: EventListeners = [
        [
            window, 'indexeddb:open', (payload: IDBListener) => {
                const { detail } = payload;
                if (!this[detail.store])
                    this[detail.store] = detail.db;
            }
        ],
        [
            '[data-component-id]', 'click', (e: FocusEvent) => {
                /* @ts-ignore */
                const button = e.target?.closest('[data-component-id]') as HTMLButtonElement;

                useGsap(({ gsap }) => {
                    const component = this.select(`[id="${button.dataset.componentId}"]` + ' > [nested]');

                    if (component?.getAttribute('nested') === 'closed') {
                        gsap.to(component, {
                            height: 'auto',
                            onComplete: () => {
                                component?.setAttribute('nested', '')
                            }
                        })

                        return;
                    }

                    gsap.to(component, {
                        height: 0,
                        overflowY: 'hidden',
                        onComplete: () => {
                            component?.setAttribute('nested', 'closed')
                        }
                    })
                })
            }
        ],
        [
            '[part=component] > div:first-child', 'click', async (e) => {
                const target = e.target as HTMLElement;
                const component = target.closest('[part=component]');
                if (!component) return;

                const id = component.id;
                const key = `component:${id}:select`;

                // DISPATCH EVENT
                Minze.dispatch(key);
            }
        ]
    ]
}