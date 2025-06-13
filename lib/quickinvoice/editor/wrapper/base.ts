import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { nanoid } from 'nanoid'

type EventDetail = Event & { detail: any }
export interface CanvasDimension {
    width?: number
    height?: number
    scale?: number
}

export interface EditorWrapperBase {
    showWarn: boolean
    canvas: {
        dimension: CanvasDimension
        dragging?: boolean
        offsetX?: number
        offsetY?: number
        touchIdentifier?: number | null
    }
}

const rr: Reactive = [
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

export abstract class EditorWrapperBase extends MinzeElement {
    // Constants that can be overridden
    protected CANVAS_PADDING = 40
    protected HANDLE_PADDING = 50
    protected DEFAULT_REACTIVE: Reactive = [
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

    // CANVAS MISSING WARNING
    warn = /*HTML*/`
        <div class="warning">
            <p>Canvas not present in Markup</p>
        </div>
    `

    tabsButton = (id: string, title: string, icon: string) => /*HTML*/`
        <button
            data-wrapper-tab="${id}"
            title="${title}">
            <span class="${icon}"></span>
        </button>
    `

    // Core methods
    protected check = {
        warn: () => {
            const slots = this.slotted('default')
            const slotTags = slots?.flatMap(d => d.tagName.toLowerCase());

            if (!slotTags?.includes('editor-canvas'))
                return this.showWarn = true

            const editorId = this.getAttribute('editor-id')!
            const editorCanvas = slots
                ?.find(d => d.tagName.toLowerCase() === 'editor-canvas')

            editorCanvas?.setAttribute('editor-id', editorId)
        },

        // @ts-ignore
        dimension: (newValue, oldValue, key, target) => {
            if (this.showWarn) return
            if (!(this.canvas.dimension.width && this.canvas.dimension.height)) return

            if (oldValue === undefined) {
                const cds = `${this.canvas.dimension.scale}`
                const ch = `${this.canvas.dimension.height}px`
                const cmw = `${this.canvas.dimension.width}px`

                this.style.setProperty('--canvas-scale', cds)
                this.style.setProperty('--canvas-height', ch)
                this.style.setProperty('--canvas-min-width', cmw)
            }

            if (key !== 'scale') return;
            this.style.setProperty('--canvas-scale', `${newValue}`)
        }
    }

    // Drag handlers
    protected handlers = {
        drag: {
            getClientPosition: (event: MouseEvent | TouchEvent) => {
                if ('touches' in event) {
                    const touch = Array.from(event.touches).find(t => t.identifier === this.canvas.touchIdentifier)
                    return touch || event.touches[0]
                }
                return event as MouseEvent
            },

            start: (event: MouseEvent | TouchEvent) => {
                if (this.showWarn) return

                const slots = this.slotted('default');
                const editorCanvas = slots
                    ?.find(d => d.tagName.toLowerCase() === 'editor-canvas');

                const rect = editorCanvas!.getBoundingClientRect();
                const pos: any = this.handlers.drag.getClientPosition(event);

                this.canvas.dragging = true;

                if ('touches' in event) {
                    this.canvas.touchIdentifier = event.touches[0].identifier
                    this.canvas.offsetX = pos.clientX - rect.left
                    this.canvas.offsetY = pos.clientY - rect.top;

                    document.body.classList.add('overflow-hidden');
                    return
                }

                this.canvas.offsetX = pos.offsetX;
                this.canvas.offsetY = pos.offsetY;

            },

            move: (event: MouseEvent | TouchEvent) => {
                if (!this.canvas.dragging || this.showWarn) return

                const pos = this.handlers.drag.getClientPosition(event)
                const rect = this.getBoundingClientRect()
                const wrapper = this.select('#canvas-container') as HTMLElement

                const newLeft = pos.clientX - rect.left - this.canvas.offsetX!
                const newTop = pos.clientY - rect.top - this.canvas.offsetY!

                wrapper.style.position = 'absolute'
                wrapper.style.left = `${newLeft}px`
                wrapper.style.top = `${newTop}px`
            },

            end: () => {
                this.canvas.dragging = false
                this.canvas.touchIdentifier = null

                document.body.classList.remove('overflow-hidden')
            }
        },
        canvas: {
            resize: (payload: EventDetail) => {
                this.canvas.dimension.scale = payload.detail.scale
            },
            ready: (payload: EventDetail) => {
                this.canvas.dimension.width = payload.detail.canvas.width;
                this.canvas.dimension.height = payload.detail.canvas.height;
            }
        },
        hooks: {
            start: () => {
                this.setAttribute('editor-id', nanoid(6));
                this.style.setProperty('--canvas-padding', `${this.CANVAS_PADDING}px`);
                this.style.setProperty('--handle-padding', `${this.HANDLE_PADDING}px`);

                // DEFINE MINZE METHODS

                // DEFINE REACTIVE
                var REACTIVE_MAP = this.DEFAULT_REACTIVE;
                if (this.reactive)
                    REACTIVE_MAP = [
                        ...this.DEFAULT_REACTIVE,
                        ...this.reactive
                    ]

                // DEFINE BASE WATCH
                var WATCH_MAP: Watch = [['canvas', this.check.dimension]];
                if (this.watch)
                    WATCH_MAP = [
                        ...this.watch,
                        ...WATCH_MAP
                    ]

                // DEFINE BASE LISTENERS
                var LISTENERS_MAP = this.baseEventListeners;
                if (this.eventListeners)
                    LISTENERS_MAP = [
                        ...this.baseEventListeners,
                        ...this.eventListeners
                    ];

                // ASSIGN METHODS
                this.watch = WATCH_MAP;
                this.eventListeners = LISTENERS_MAP;
                this.reactive = REACTIVE_MAP
            },

            ready: () => {
                this.check.warn();
                console.log('ready from base')
                this.dispatch('editor-wrapper:ready', { wrapper: this });
            }
        }
    }

    protected baseEventListeners: EventListeners = [
        // Mouse events
        [window, 'mousemove', this.handlers.drag.move],
        [window, 'canvas:startdrag', (_) => this.handlers.drag.start(_.detail)],
        [window, 'canvas:enddrag', this.handlers.drag.end],
        // Touch events - Not implemented yet
        ['#canvas-container', 'touchstart', this.handlers.drag.start],
        [window, 'touchmove', this.handlers.drag.move],
        [window, 'touchend', this.handlers.drag.end],
        // Canvas events
        [window, 'canvas:resize', this.handlers.canvas.resize],
        [window, 'canvas:ready', this.handlers.canvas.ready],
        // TAB EVENTS
        ['[data-wrapper-tab]', 'click', (event) => {
            // GET TAB ELEMENT
            const button = event.target.closest('[data-wrapper-tab]');
            const tabId = button.getAttribute('data-wrapper-tab');
            // @ts-ignore // RUN FUNCTION
            this.TABS[tabId]?.action()
        }],
    ]
}