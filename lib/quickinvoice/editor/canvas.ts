import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import { MinzeElement } from 'minze';

import css from './styles/canvas.css?inline'
import componentCss from './styles/component.css?inline'

import { EditorCanvasBase } from './base/canvas';

export interface EditorCanvas {
    canvas: {
        width: number,
        height: number
    },

    canvasScale: number,
    resizeTimeout?: NodeJS.Timeout,
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
        }],

        'canvasScale',
        'resizeTimeout',
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

    css = () => `
        @unocss-placeholder

        :host {
            width: ${this.canvas.width}px;
            height: ${this.canvas.height}px;
            position: relative;
            display: block;
        }

        :not(:defined) {
            visibility: hidden;
        }

        ${css}
        ${componentCss}

        @media (max-width: ${this.canvas.width + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
            :host {
                --canvas-scale: 1;
                transform: scale(var(--canvas-scale));
                position: absolute;
            }
        }
    `

    eventListeners: EventListeners = [
        ...this.handleEvents,
        [window, 'resize', this.scaleCanvas],
        [window, 'editor-wrapper:ready', async () => {
            this.scaleCanvas();
            this.dispatch('canvas:ready', { canvas: this.canvas });
            /* this.rerender() */
        }],
        [
            window, 'keyup', (e: KeyboardEvent) => {
                if (e.key.toLowerCase() === 'delete' && this.selectedComponent) {
                    // Get the canvas of the selected component
                    const selectedCanvas = this.selectedComponent.closest('[data-dropzone-id]');
                    const canvasCapabilities: ComponentCapabilities = JSON.parse(selectedCanvas?.getAttribute('capabilities') || '{}')
                    const capabilities: ComponentCapabilities = JSON.parse(this.selectedComponent?.getAttribute('capabilities') || '{}')

                    /* console.log('Selected component\'s canvas:', selectedCanvas);
                    console.log(capabilities) */

                    /* CHECK IF CONTAINER ALLOWS TO DELETE */
                    if (canvasCapabilities?.canBeDeleted === false)
                        return console.warn('Component cannot be deleted');

                    /* CHECK IF COMPONENT IS CONTAINER */
                    const root = this.selectedComponent.shadowRoot
                    Array.from(root?.querySelectorAll('editor-component') || [])
                        .forEach(child => {
                            this.session.delete(child.id);
                            child.remove();
                        });
                        
                    this.session.delete(this.selectedComponent.id);
                    this.selectedComponent.remove();
                    this.components.select(null)
                }
            }
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
        ]
    ]

    onStart() {
        /* await this.space.open(); */
        this.dropzone.hooks.start();
    }

    async onReady() {
        await this.space.open();
        await this.dropzone.setup();
        await this.session.open();
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

                    const component = this.components.create(entry.type, undefined, undefined, undefined, {
                        properties: entry.properties,
                        id: entry.id,
                        "sub-elements": entry?.subElements,
                        styles: entry?.styles
                    });

                    if (rootElement) rootElement.appendChild(component)
                    else { canvas?.appendChild(component) }
                })
        })
    }
}