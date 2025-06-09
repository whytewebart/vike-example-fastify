import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { nanoid } from 'nanoid'

export interface EditorWrapper {
    showWarn: boolean,
    canvas: {
        dimension: {
            width?: number,
            height?: number,
            scale: 1
        },

        dragging?: boolean,
        offsetX?: number,
        offsetY?: number,
        touchIdentifier?: number | null
    }
}

type EventDetail = Event & { detail: any }

export class EditorWrapper extends MinzeElement {
    options = { cssReset: false }

    CANVAS_PADDING = 40
    HANDLE_PADDING = 50;

    // DEFINE EDITOR PROPS
    reactive: Reactive = [
        ['showWarn', false],
        [
            'canvas',
            {
                dimension: {
                    width: undefined,
                    height: undefined,
                    scale: undefined
                },

                dragging: false,
                offsetX: undefined,
                offsetY: undefined,
                touchIdentifier: null
            }
        ]
    ]

    // HANDLE CLASSES
    unocss = {
        warn: [
            // 'absolute top-0 left-0 right-0',
            'w-fit mx-auto',
            'flex items-center justify-center',
        ],

        'warn-p': [
            'px-4 py-1',
            'rounded-xl rounded-t-0',
            'text-red-500 text-sm font-semibold font-urbanist',
            'bg-red-100'
        ]
    }

    // WARN METHODS
    check = {
        warn: () => {
            const slots = this.slotted('default');
            const slotTags = slots?.flatMap(d => d.tagName.toLowerCase());

            if (!slotTags?.includes('editor-canvas'))
                return this.showWarn = true;

            const editorId = this.getAttribute('editor-id')!;
            const editorCanvas = slots
                ?.find(d => d.tagName.toLowerCase() === 'editor-canvas');

            editorCanvas?.setAttribute('editor-id', editorId)
        },

        // @ts-ignore
        dimension: (newValue, oldValue, key, target) => {
            if (this.showWarn) return;
            if (!(this.canvas.dimension.width && this.canvas.dimension.height)) return;
            const container = this.select('#canvas-container') as HTMLElement;

            // INITIALIZE DIMENSION PROPERTIES
            if (oldValue === undefined) {
                const cds = `${this.canvas.dimension.scale}`
                const ch = `${this.canvas.dimension.height}px`
                const cmw = `${this.canvas.dimension.width}px`

                // Set initial CSS variables
                container.style.setProperty('--canvas-scale', cds);
                container.style.setProperty('--canvas-height', ch);
                container.style.setProperty('--canvas-min-width', cmw);

                this.style.setProperty('--canvas-height', ch);
                this.style.setProperty('--canvas-scale', cds);

            }

            // UPDATE SCALE PROPERTY
            if (key !== 'scale') return;

            const cds = `${newValue}`;
            container.style.setProperty('--canvas-scale', cds);
            this.style.setProperty('--canvas-scale', cds);

        },

        // Helper method to get touch position
        getClientPosition: (event: MouseEvent | TouchEvent): { clientX: number, clientY: number, offsetX?: number, offsetY?: number } => {
            if ('touches' in event) {
                const touch = Array.from(event.touches).find(t => t.identifier === this.canvas.touchIdentifier);
                return touch || event.touches[0];
            }
            return event;
        },

        // Drag handlers
        handleDragStart: (event: MouseEvent | TouchEvent) => {
            if (this.showWarn) return;

            const rect = this.getBoundingClientRect();
            const pos = this.check.getClientPosition(event);

            if ('touches' in event)
                this.canvas.touchIdentifier = event.touches[0].identifier;

            this.canvas.dragging = true;
            this.canvas.offsetX = pos.offsetX || pos.clientX - rect.left;
            this.canvas.offsetY = pos.offsetY || pos.clientY - rect.top;
        },

        handleDragMove: (event: MouseEvent | TouchEvent) => {
            if (!this.canvas.dragging || this.showWarn) return;

            const pos = this.check.getClientPosition(event);
            const rect = this.getBoundingClientRect();
            const wrapper = this.select('#canvas-container') as HTMLElement;

            const newLeft = pos.clientX - rect.left - this.canvas.offsetX!;
            const newTop = pos.clientY - rect.top - this.canvas.offsetY!;

            wrapper.style.position = 'absolute';
            wrapper.style.left = `${newLeft}px`;
            wrapper.style.top = `${newTop - 50}px`;
        },

        handleDragEnd: () => {
            this.canvas.dragging = false;
            this.canvas.touchIdentifier = null;
        }
    }

    // CANVAS MISSING WARNING
    warn = /*HTML*/`
        <div class="${this.unocss.warn.join(' ')}">
            <p class="${this.unocss['warn-p'].join(' ')}">
                Canvas not present in Markup
            </p>
        </div>
    `

    html = () => /*HTML*/`
        ${this.showWarn ? this.warn : ''}
        <div id="canvas-container">
            <slot></slot>
        </div>
        <slot name="named-slot"></slot>
    `

    css = () => /*CSS*/`
        @unocss-placeholder

        #canvas-container {
            display: grid;
            justify-items: center;
            align-items: center;

            min-width: calc(var(--canvas-min-width) * var(--canvas-scale));
            height: calc(var(--canvas-height) * var(--canvas-scale));

            position: relative;
            margin: 0 auto;
        }

        :host {
            --calc-height-scale: calc(var(--canvas-height) * var(--canvas-scale));
            --calc-handles: calc(var(--calc-height-scale) + ${this.HANDLE_PADDING}px + ${this.CANVAS_PADDING}px);
            --calc-diff: calc(var(--canvas-height) - var(--calc-height-scale));
            --calc-h-scale: calc(var(--canvas-height) + var(--calc-diff));

            min-height: var(--calc-handles);
            position: relative;
            top: 0;
            display: grid;
            justify-content: center;
            align-items: center;
        }

        @media (min-width: ${(this.canvas.dimension.width || 0) + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
            #canvas-container {
                width: fit-content;
                height: var(--canvas-height);
            }

            :host {
                min-height: var(--calc-h-scale);
            }
        }

        @media (min-height: ${(this.canvas.dimension.height || 0)}px) {
            :host {
                min-height: var(--calc-handles);
            }
        }
    `

    watch: Watch = [
        ['canvas', this.check.dimension]
    ]

    eventListeners: EventListeners = [
        [window, 'canvas:resize', (payload: EventDetail) => {
            this.canvas.dimension.scale = payload.detail.scale
        }],
        [window, 'canvas:ready', (payload: EventDetail) => {
            this.canvas.dimension.width = payload.detail.canvas.width;
            this.canvas.dimension.height = payload.detail.canvas.height;
        }],

        // Mouse events
        [window, 'mousemove', this.check.handleDragMove],
        [window, 'canvas:startdrag', (payload: EventDetail) => this.check.handleDragStart(payload.detail)],
        [window, 'canvas:enddrag', this.check.handleDragEnd],

        // Touch events
        ['#canvas-container', 'touchstart', this.check.handleDragStart],
        [window, 'touchmove', this.check.handleDragMove],
        [window, 'touchend', this.check.handleDragEnd],
    ]

    onStart() {
        this.setAttribute('editor-id', nanoid(6));
        this.classList.add('app-scrollbar', 'overflow-hidden');
    }

    onReady() {
        this.check.warn();
    }
}