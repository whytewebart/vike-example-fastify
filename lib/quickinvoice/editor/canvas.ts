import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import { MinzeElement } from 'minze';

import css from './styles/canvas.css?inline'

export interface EditorCanvas {
    canvas: {
        width: number,
        height: number
    },

    canvasScale: number,
    resizeTimeout?: NodeJS.Timeout,
}

type EventDetail = Event & { detail: any }

export class EditorCanvas extends MinzeElement {
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
            'text-xs font-urbanist font-semibold capitalize',
            'hover:cursor-grab',
            'transition-all',
            'pointer-events-auto absolute z-10',
            // 'opacity-0 hover:opacity-100',
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
            const containerWidth = window.innerWidth - this.CANVAS_PADDING - this.HANDLE_PADDING;
            const containerHeight = window.innerHeight;

            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;

            // Compute scale factor based on
            // smaller dimension (to maintain aspect ratio)
            const scaleX = containerWidth / canvasWidth;
            const scaleY = containerHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY, 1); // Don't scale above 100%

            console.log('Scaling canvas:', scale)

            if (this.canvasScale !== scale) {
                this.canvasScale = scale;
                this.setAttribute('style', `--canvas-scale:${scale};`);
                this.dispatch('canvas:resize', { scale });
            }
        }, this.RESIZE_TIMEOUT);

    }

    html = () => /*html*/`
            ${this.handle}
        <div id="canvas" class="bg-white relative z-1">
            <p class="text-2xl">${this.canvasScale}</p>
            <slot></slot>
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

        ${css}

        :host:has(#handle:hover) #canvas,
        :host:has(#handle:hover) {
            --drag-border-color:rgba(99, 97, 97, 0.17)
        }

        :host:has(#handle button:hover) #canvas,
        :host:has(#handle button:hover) {
            --drag-border-color:rgba(136, 129, 240, 0.41) !important;
            --drag-border-width: 3px !important
        }

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
    ]

    onReady() {
        this.dispatch('canvas:ready', { canvas: this.canvas });
        this.scaleCanvas();
    }
}