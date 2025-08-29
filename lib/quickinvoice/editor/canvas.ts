import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import { MinzeElement } from 'minze';

import css from './styles/canvas.css?inline'
import componentCss from './styles/component.css?inline'
import resetcss from "@unocss/reset/tailwind-compat.css?inline"

import { EditorCanvasBase } from './base/canvas';
import { EditorComponent } from './component';
import { customAlphabet } from 'nanoid';

export interface EditorCanvas {
    canvas: {
        width: number,
        height: number
    },

    canvasScale: number,
    resizeTimeout?: NodeJS.Timeout,
    _cache_registered: boolean
}

type EventDetail = Event & { detail: any }

export class EditorCanvas extends EditorCanvasBase {
    options = { cssReset: false }

    RESIZE_TIMEOUT = 0;
    CANVAS_PADDING = 40;
    HANDLE_PADDING = 50;

    // DEFINE EDITOR ATTRIBUTES
    attrs: Attrs = []

    // DEFINE EDITOR PROPS
    reactive: Reactive = [
        ['canvas', {
            width: 535,
            height: 760,
            // width: 595,
            // height: 842,
        }],

        'canvasScale',
        'resizeTimeout',
        '_cache_registered'
    ]

    // HANDLE CLASSES
    unocss = {
        handle: [
            'py-1 px-4 rounded-t-lg',
            'border border-b-0 hover:b-b-2 hover:border-b-indigo-400',
            'bg-gray-100 hover:bg-gray-50',
            'w-fit',
            'text-xs font-space-mono font-semibold capitalize',
            'hover:cursor-grab',
            'transition-all',
            'pointer-events-auto absolute z-1',
            'opacity-0 hover:opacity-100',
        ]
    }

    // DRAG HANDLE
    handle = /*html*/`
        <div id="handle">
            ${['top', 'left', 'right', 'bottom']
            .map(position => /*html*/`
                    <button
                        position="${position}"
                        class="${this.unocss.handle.join(' ')}">
                        Drag Canvas ${position}
                    </button>`)
            .join('')
        }
        </div>
    `

    // METHODS
    // DRAG EVENTS
    handleEvents: EventListeners = [
        [
            '#handle button', 'mousedown', (event: MouseEvent) => {
                const rect = this.getBoundingClientRect();

                this.dispatch('canvas:startdrag', {
                    offsetX: event.clientX - rect.left,
                    offsetY: event.clientY - rect.top
                });

                this.style.transition = 'none'
            }
        ],
        [window, 'mouseup', () => { this.dispatch('canvas:enddrag') }]
    ]

    registerComponents = async () => {
        /* GET CURRENT SESSION */
        const active = (await this.space.findByIndex('latest', "true"))[0];
        /* const query = IDBKeyRange.bound(active.id, [active.id, []]) */
        const query = IDBKeyRange.only([active.id, active.id])
        await this.session.findByIndex("sessionId", query).then(response => {
            const canvas = this.select(`[data-dropzone-id="${active.id}"]`);
            response
                .sort((a, b) => a.order - b.order)
                .map(entry => {
                    if (entry.dropzone !== active.id) return;
                    const rootElement = this.select(`[data-dropzone-id="${entry.dropzone}"]`);

                    const component = this.components.create(entry.type, undefined, {
                        properties: entry.properties,
                        id: entry.id,
                        "sub-elements": entry?.subElements,
                        styles: entry?.styles,
                        label: entry?.label
                    });

                    if (rootElement) rootElement.appendChild(component)
                    else { canvas?.appendChild(component) }
                })
        });

        this._cache_registered = true;
    }

    _uniqueId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10);

    recurisveNestedFind(el: EditorComponent) {
        const element = document.createElement('div');
        // DEFINE UNIQUE IDS
        const hostId = this._uniqueId()
        // DEFINE SANITIZED DOM
        const _html = el.shadowRoot?.innerHTML!.replaceAll(/(?<!:)\bhost\b/g, hostId)
        const _css = el.privateCss().replaceAll(/(?<!:)\bhost\b/g, hostId)
        // APPEND HTML
        element.innerHTML += `<style>${_css}</style>`;
        element.innerHTML += _html;
        // REMOVE DRAG HANDLE
        element.querySelector('button#handle')?.remove();
        element.querySelector('style[ref="button-handle"]')?.remove();
        // GET ID
        const id = el.getAttribute("id")!
        const shadowRoot = el.shadowRoot;
        const query = <NodeListOf<EditorComponent>>element?.querySelectorAll('editor-component');

        for (const nested of query) {
            const id = nested.getAttribute("id")!;
            const element = <EditorComponent>shadowRoot?.querySelector(`[id="${id}"]`)
            const response = this.recurisveNestedFind(element)
            const key = Object.keys(response)[0]
            const { html } = response[key];

            nested.parentElement?.appendChild(html);
            nested.remove();
        }

        return {
            [id]: {
                html: document.createRange().createContextualFragment(element?.innerHTML)
            }
        }
    }

    // DOWNLOAD
    print = async () => {
        if (!this.session) {
            alert('DB not initialized. try again in a few minutes')
        };

        const spaces = await this.space.findByIndex("latest", "true");
        if (!(spaces.length > 0)) return;

        /* CLEAR THE CANVAS */
        const canvas = this.select<HTMLElement>("#canvas")!
        const invoiceHTML = document.createElement('div');
        const invoiceScaleWrapper = document.createElement('div')
        const invoiceContainer = document.createElement('div');

        const canvasChildren: EditorComponent[] = Array.from(canvas.querySelectorAll('editor-component'))

        invoiceHTML.innerHTML += /*html*/`
            <style>
                ${resetcss}
                ${componentCss}
            </style>
        `

        Array.from(canvasChildren)
            .map(el => this.recurisveNestedFind(el))
            .forEach(entry => {
                const key = Object.keys(entry)[0];
                const { html } = entry[key];

                invoiceHTML.appendChild(html)
            });


        // REMOVE ALL SLOTS
        invoiceHTML.querySelectorAll('slot').forEach(slot => slot.remove())
        // SET INVOICE HTML ID
        invoiceHTML.id = 'document-to-print';
        // SET CONTAINER STYLES
        invoiceContainer.style.width = `${this.canvas.width * this.canvasScale}px`;
        invoiceContainer.style.height = `${this.canvas.height * this.canvasScale}px`;
        invoiceContainer.style.display = 'grid';
        invoiceContainer.style.justifyContent = 'center';
        invoiceContainer.style.alignContent = 'center';
        invoiceContainer.style.margin = '0px auto';
        // SET INVOICE SCALE WRAPPER SCALE
        invoiceScaleWrapper.style.transform = `scale(${this.canvasScale})`;
        // SET INVOICE CONTAINER STYLES
        invoiceHTML.style.width = `${this.canvas.width}px`;
        invoiceHTML.style.height = `${this.canvas.height}px`;
        invoiceHTML.style.display = 'flex';
        invoiceHTML.style.flexDirection = 'column';
        invoiceHTML.style.background = 'white';

        // SET STRUCTURE
        invoiceScaleWrapper.appendChild(invoiceHTML);
        invoiceContainer.appendChild(invoiceScaleWrapper);
        // SET TO WINDOWS OBJECT
        window.invoiceHTML = document.createRange().createContextualFragment(invoiceContainer.outerHTML);
        this.dispatch('print-invoice', { toPrint: window.invoiceHTML, })
    }

    scaleCanvas() {
        clearTimeout(this.resizeTimeout)

        this.resizeTimeout = setTimeout(() => {
            const padding = this.HANDLE_PADDING
            const containerWidth = window.innerWidth - padding;
            const containerHeight = window.innerHeight;

            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;

            // Compute scale factor based on
            // smaller dimension (to maintain aspect ratio)
            const scaleX = containerWidth / canvasWidth;
            const scaleY = containerHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY, 1); // Don't scale above 100%

            // console.log("canvas:ready was dispatched")

            if (this.canvasScale !== scale) {
                this.canvasScale = scale;
                this.setAttribute('style', `--canvas-scale:${scale};`);
                this.dispatch('canvas:resize', { scale });
            }
        }, this.RESIZE_TIMEOUT);

    }

    html = () => /*html*/`
        ${this.handle}
        <div id="canvas" data-dropzone-id="${this.CANVAS_ID}" class="shadow">
        </div>
    `

    css = () => {
        
        const pre = /*css*/`
            :host {
                width: ${this.canvas.width}px;
                height: ${this.canvas.height}px;
                position: relative;
                display: block;
            }

            :not(:defined) {
                visibility: hidden;
            }
        `;

        const post = /*css*/`
            @media (max-width: ${this.canvas.width + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
                :host {
                    --canvas-scale: 1;
                    transform: scale(var(--canvas-scale));
                    position: absolute;
                }
            }
        `

        return /*css*/`
            @unocss-placeholder ${pre}${css}${componentCss}${post};    
        `
    }

    async deleteComponentRecursively(component: HTMLElement, deleteFromDB = false) {
        const shadowRoot = component.shadowRoot;

        // 1. Get all <editor-component> children inside the shadow DOM
        const shadowChildren = Array.from(
            shadowRoot?.querySelectorAll('editor-component') || []
        ) as HTMLElement[];

        // 2. Get all <slot> elements and their assigned nodes
        const slotElements = Array.from(
            shadowRoot?.querySelectorAll('slot') || []
        ) as HTMLSlotElement[];

        // 3. Collect <editor-component> elements from slotted content
        const slottedChildren: HTMLElement[] = [];
        for (const slot of slotElements) {
            const assignedElements = slot.assignedElements({ flatten: true }) as HTMLElement[];
            const editorComponents = assignedElements.filter(el => el.tagName.toLowerCase() === 'editor-component');
            slottedChildren.push(...editorComponents);
        }

        // Combine shadow and slotted children
        const allChildren = [...shadowChildren, ...slottedChildren];

        // 4. Recursively delete all children
        for (const child of allChildren) {
            await this.deleteComponentRecursively(child, deleteFromDB);
        }

        // 5. Delete the current component
        if (deleteFromDB) { await this.session.delete(component.id); }
        component.remove();
    };

    deleteComponentRequest = async () => {
        if (!this.selectedComponent) return;
        var selectedCanvas = this.selectedComponent.closest<HTMLElement>('[data-dropzone-id]');
        if (!selectedCanvas) {
            selectedCanvas = this.selectedComponent.closest('[strictzone]')
        }

        if (!selectedCanvas) return;

        const canvasCapabilities: ComponentCapabilities = JSON.parse(
            selectedCanvas?.getAttribute('capabilities') || '{}'
        );
        const capabilities: ComponentCapabilities = JSON.parse(
            this.selectedComponent?.getAttribute('capabilities') || '{}'
        );

        if (canvasCapabilities?.canBeDeleted === false) {
            return console.warn('Component cannot be deleted');
        }

        // Recursive delete function
        await this.deleteComponentRecursively(this.selectedComponent, true);
        this.components.select(null);

        this.dropzone.methods.resetDropHighilght(selectedCanvas!)

    }


    eventListeners: EventListeners = [
        ...this.handleEvents,
        [window, 'resize', this.scaleCanvas],
        [window, 'editor-wrapper:ready', async () => {
            this.scaleCanvas();
            this.dispatch('canvas:ready', { canvas: this.canvas });
            /* this.rerender() */
        }],
        [
            window, 'keyup', async (e: KeyboardEvent) => {
                if (e.key.toLowerCase() === 'delete') {
                    await this.deleteComponentRequest()
                }
            }
        ],
        [
            window, 'canvas:component:delete', this.deleteComponentRequest
        ],
        [
            window, 'components:reorder', (e: EventDetail) => {
                const component = e.detail?.component as HTMLElement | null;
                const dropzone = component?.closest('[data-dropzone-id]');
                const children = Array.from(dropzone?.children || []);

                /* console.log("called", e.detail.component, children) */

                children.forEach(async (el, i) => {
                    if (el.tagName.toLowerCase() === 'slot') return
                    /* UPDATE ELEMENTS WITH WRONG INDEX */
                    const entry = await this.session.get(el.id);
                    this.session.update({
                        ...entry!,
                        index: i,
                        order: i
                        // order: children[i - 1]?.id
                    })

                    /* REMOVE STATE */
                    el.removeAttribute('state')
                })
            }
        ],
        /* LISTEN TO WINDOW REGISTER TEMPLATE EVENT */
        [
            window, 'components:register-template', async (e: EventDetail) => {
                const { template } = e.detail;
                if (!template) return;
                /* CLEAR THE CANVAS */
                const canvas = this.select("#canvas") as HTMLElement;
                const editors = canvas.querySelectorAll<HTMLElement>('editor-component');

                for (const editor of editors) {
                    await this.deleteComponentRecursively(editor, true)
                };
                /* REGISTER THE TEMPLATE */
                this.components.create(template.type, canvas!);
                console.log(`Template ${template.type} registered successfully.`);
            }
        ],
        [
            window, 'canvas:select:random', (e: EventDetail) => {
                const random = this.select<HTMLElement>('editor-component');
                if (random) {
                    this.components.select(random)
                }
            }
        ],
        [
            window, 'editor-canvas:download:print', this.print
        ]
    ]

    onStart() {
        // DEFINE REACTIVE
        var REACTIVE_MAP = this.DEFAULT_REACTIVE;
        if (this.reactive)
            REACTIVE_MAP = [
                ...this.DEFAULT_REACTIVE,
                ...this.reactive
            ]

        // SET LISTENERS
        const LISTENERS_MAP = this.baseEventListeners;

        this.eventListeners = [
            // @ts-ignore
            ...this.eventListeners,
            ...LISTENERS_MAP
        ];

        window.activeComponent = {};
    }

    async onReady() {
        await this.space.open();
        await this.dropzone.setup();
        await this.session.open();

        await this.registerComponents()
    }
}