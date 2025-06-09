import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { nanoid } from 'nanoid'

import css from './styles/wrapper.css?inline'

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

    // WARN COMPONENT METHODS
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

            // INITIALIZE DIMENSION PROPERTIES
            if (oldValue === undefined) {
                const cds = `${this.canvas.dimension.scale}`
                const ch = `${this.canvas.dimension.height}px`
                const cmw = `${this.canvas.dimension.width}px`

                // Set initial CSS variables
                this.style.setProperty('--canvas-scale', cds);
                this.style.setProperty('--canvas-height', ch);
                this.style.setProperty('--canvas-min-width', cmw);
            }

            // UPDATE SCALE PROPERTY
            if (key !== 'scale') return;

            const cds = `${newValue}`;
            this.style.setProperty('--canvas-scale', cds);

        }
    }

    // LISTEN TO ATTRIBUTES
    watch: Watch = [
        ['canvas', this.check.dimension]
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
        ],

        infoButton: [
            'absolute top-0 right-0 z-1',
            'hover:bg-gray-200 transition-colors',
            'border border-t-0',
            'p-2'
        ]
    }

    // CANVAS MISSING WARNING
    warn = /*HTML*/`
        <div class="${this.unocss.warn.join(' ')}">
            <p class="${this.unocss['warn-p'].join(' ')}">
                Canvas not present in Markup
            </p>
        </div>
    `

    // CANVAS INFO BUTTON
    infoButton = /*HTML*/`
        <button class="${this.unocss.infoButton.join(' ')}" title="Canvas Info">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                <path d="M11 8h2v4h-2z"></path>
            </svg>
        </button>
    `

    html = () => /*HTML*/`
        ${this.showWarn ? this.warn : ''}
        <div section="canvas">
            ${this.infoButton}
            <div id="canvas-container">
                <slot></slot>
            </div>
        </div>
        <div section="panels">
            <slot name="panels">
                <div class="panels-content app-scrollbar">
                    <!-- Blocks -->
                    <div class="blocks min-h-4xl">
                        <div class="py-2 px-4" flex="~ justify-between items-center" border="b-1" sticky top-0>
                            <p class="font-urbanist font-semibold">Layouts</p>
                            <span class="i-solar-alt-arrow-down-outline text-xl"></span>
                        </div>
                    </div>
                    <!-- Customization -->
                    <div class="customize min-h-5xl"></div>
                </div>
            </slot>
        </div>
    `

    css = () => `
        @unocss-placeholder

        ${css}

        @media (min-width: ${this.canvas.dimension.width! + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
            #canvas-container {
                width: fit-content;
                height: var(--canvas-height);
            }

            [section="canvas"] {
                /* height: var(--calc-h-scale); */
                height: calc(var(--canvas-height) + var(--canvas-padding) + var(--canvas-padding));
                min-width: calc(var(--canvas-min-width) + var(--handle-padding) + var(--handle-padding));
            }
        }

        @media (min-height: ${this.canvas.dimension.height}px) {
            [section="canvas"] { height: var(--calc-handles); }
            div[section="panels"] { max-height: var(--calc-handles); }
        }
    `

    onStart() {
        this.setAttribute('editor-id', nanoid(6));
        this.style.setProperty('--canvas-padding', `${this.CANVAS_PADDING}px`);
        this.style.setProperty('--handle-padding', `${this.HANDLE_PADDING}px`);
    }

    onReady() {
        this.dispatch('editor-wrapper:ready', { wrapper: this });
        this.check.warn();
    }

    // EVENT HANDLERS
    handlers = {
        drag: {
            // Helper method to get touch position
            getClientPosition: (event: MouseEvent | TouchEvent): { clientX: number, clientY: number, offsetX?: number, offsetY?: number } => {
                if ('touches' in event) {
                    const touch = Array.from(event.touches).find(t => t.identifier === this.canvas.touchIdentifier);
                    return touch || event.touches[0];
                }
                return event;
            },

            // Drag handlers
            start: (event: MouseEvent | TouchEvent) => {
                if (this.showWarn) return;

                const rect = this.getBoundingClientRect();
                const pos = this.handlers.drag.getClientPosition(event);

                if ('touches' in event)
                    this.canvas.touchIdentifier = event.touches[0].identifier;

                this.canvas.dragging = true;
                this.canvas.offsetX = pos.offsetX || pos.clientX - rect.left;
                this.canvas.offsetY = pos.offsetY || pos.clientY - rect.top;
            },

            move: (event: MouseEvent | TouchEvent) => {
                if (!this.canvas.dragging || this.showWarn) return;

                const pos = this.handlers.drag.getClientPosition(event);
                const rect = this.getBoundingClientRect();
                const wrapper = this.select('#canvas-container') as HTMLElement;

                const newLeft = pos.clientX - rect.left - this.canvas.offsetX!;
                const newTop = pos.clientY - rect.top - this.canvas.offsetY!;

                wrapper.style.position = 'absolute';
                wrapper.style.left = `${newLeft}px`;
                wrapper.style.top = `${newTop}px`;
            },

            end: () => {
                this.canvas.dragging = false;
                this.canvas.touchIdentifier = null;
            }
        }
    }

    // EVENT LISTENERS
    eventListeners: EventListeners = [
        [window, 'canvas:resize', (payload: EventDetail) => {
            this.canvas.dimension.scale = payload.detail.scale
        }],
        [window, 'canvas:ready', (payload: EventDetail) => {
            this.canvas.dimension.width = payload.detail.canvas.width;
            this.canvas.dimension.height = payload.detail.canvas.height;
        }],

        // Mouse events
        [window, 'mousemove', this.handlers.drag.move],
        [window, 'canvas:startdrag', (_) => this.handlers.drag.start(_.detail)],
        [window, 'canvas:enddrag', this.handlers.drag.end],

        // Touch events - Not implemented yet
        /* ['#canvas-container', 'touchstart', this.check.handleDragStart],
        [window, 'touchmove', this.check.handleDragMove],
        [window, 'touchend', this.check.handleDragEnd], */
    ]
}