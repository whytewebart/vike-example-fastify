import { Attrs, EventListeners, MinzeElement, Reactive } from 'minze'
import { nanoid } from 'nanoid';
import { IndexedDBWrapper } from '../component/utils/state';
import { rejects } from 'assert';

export interface EditorCanvasBase {
    selectedComponent: HTMLElement | null;
    isDraggingNewComponent: boolean;
    layers: any[];
}

type objectStore = [string, { keypath?: string }?];
/**
 * EDITOR CANVAS BASE CLASS
 * Contains core drag-and-drop functionality and editor state management
 * Extend this class to create custom editor implementations
 */
export class EditorCanvasBase extends MinzeElement {
    DB_VERSION = 1;
    DB_NAME = 'quickinvoice';
    // ======================
    // REACTIVE PROPERTIES
    // ======================
    protected DEFAULT_REACTIVE: Reactive = [
        ['selectedComponent', null],  // Currently selected component
        ['isDraggingNewComponent', false], // Flag for new component drag
        ['layers', []] // Array to track all components (optional)
    ]

    quickinvoiceOpts = {
        stores: [
            ["space"],
            ["session"]
        ] as objectStore[],

        onUpgrade: async (db: IDBDatabase, transaction: IDBTransaction | null) => {
            // CREATE OBJECT STORE
            await new Promise((resolve, reject) => {
                // FILTER EXISTING STORES
                const fileterd = this.quickinvoiceOpts.stores
                    .filter(([name]) => {
                        return !db.objectStoreNames.contains(name)
                    });
                // LENGTH OF NEW STORES
                const storesLen = fileterd.length;
                if (storesLen === 0) return resolve(fileterd);
                // CREATE NEW STORES
                fileterd
                    .map((entry, index) => {
                        const [name, opt] = entry;
                        // CREATE OBJECT STORE
                        db.createObjectStore(name, {
                            keyPath: opt?.keypath || 'id'
                        });
                        // RESOLVE PROMISE
                        if (index === storesLen - 1) resolve(entry);
                    })
            })
            // RUN COMMANDS (CREATE INDEX)
            this.quickinvoiceOpts.stores
                .map(([name, opt]) => {
                    const store = transaction!.objectStore(name)
                    // CREATE INDEX FOR "session" store
                    if (name === 'session') {
                        // CREATE INDEXES
                        store.createIndex('sessionId',
                            ['sessionId', 'dropzone'], { unique: false });
                        store.createIndex('order', ['index', "key"], { unique: true });
                    }

                    // CREATE INDEX FOR "space" store
                    if (name === 'space') {
                        // CREATE INDEXES
                        store.createIndex('latest', 'lastSession', { unique: true });
                    }
                })
        },
    }

    protected session = new IndexedDBWrapper<DB.Session>(this.DB_NAME, 'session', this.DB_VERSION, this.quickinvoiceOpts);

    protected space = new IndexedDBWrapper<DB.Space>(this.DB_NAME, 'space', this.DB_VERSION, this.quickinvoiceOpts)

    // ======================
    // CONSTANTS
    // ======================
    BLOCK_TYPES = [
        'heading', 'paragraph', 'image',
        'button', 'divider', 'container', 'test'
    ]

    CANVAS_ID = nanoid();

    // ======================
    // CORE METHODS
    // ======================

    protected dropzone = {
        /**
         * Initialize a canvas as a drop zone
         * @param {HTMLElement} canvas - The element to make droppable
         */
        setup: async (canvas?: Element) => {
            // CREATE DROPZONE
            var dropzoneId = this.CANVAS_ID;
            // GET LAST SPACE SESSION
            await this.space.open();
            await this.space.findByIndex('latest', "true")
                .then(response => {
                    if (response.length === 0) {
                        // CREATE SPACE
                        this.space.add({
                            id: dropzoneId,
                            lastSession: "true",
                            properties: {}
                        });

                        return;
                    }
                    // UPDATE DROPZONE ID
                    dropzoneId = response[0].id;
                })

            // IF CANVAS ARGUMENT IS NOT PRESENT
            if (!canvas) {
                canvas = this.select(`[data-dropzone-id="${this.CANVAS_ID}"]`)!
                canvas?.setAttribute('data-dropzone-id', dropzoneId)
                this.setAttribute('editor-id', dropzoneId)
            }

            // IF CANVAS ARGUMENT IS PRESENT
            if (!canvas?.getAttribute('data-dropzone-id'))
                canvas?.setAttribute('data-dropzone-id', nanoid());
        },
        // ======================
        // HELPER METHODS
        // ======================
        methods: {
            /**
             * Handle dragover event for drop zones
             * @param {HTMLElement} container - The drop zone
             * @param {number} clientY - Mouse/touch Y position
             */
            dragover: (container: HTMLElement, clientY: number) => {
                // Show insertion indicator for non-empty containers
                const afterElement = this.dropzone.methods.dragafter(container, clientY)
                const components = Array.from(container.children)
                    .filter(el => el.classList.contains('component'));
                // @ts-ignore
                components.forEach(c => c.style.borderTop = '')
                if (afterElement) {
                    afterElement.style.borderTop = '2px solid #4CAF50'
                }
            },

            dragafter: (container: HTMLElement, y: number) => {
                const draggableElements = [...container.querySelectorAll('.component:not(.dragging)')]

                return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect()
                    const offset = y - box.top - box.height / 2

                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child }
                    } else {
                        return closest
                    }
                    // @ts-ignore
                }, { offset: Number.NEGATIVE_INFINITY })?.element
            },

            /**
             * Reset drop zone highlighting
             * @param {HTMLElement} container - The drop zone
             */
            resetDropHighilght: (container: HTMLElement) => {
                const placeholder = container.querySelector('.component-placeholder')
                if (placeholder) placeholder.classList.remove('highlight');
                // @ts-ignore
                Array.from(container.children).forEach(c => c.style.borderTop = '')
            },

            /**
             * Handle drop event for drop zones
             * @param {HTMLElement} container - The drop zone
             * @param {DragEvent} e - The drop event
             */
            drop: (container: HTMLElement, e: DragEvent) => {
                const type = e.dataTransfer?.getData('text/plain')
                const afterElement = this.dropzone.methods
                    .dragafter(container, e.clientY)

                if (type === 'move') {
                    // MOVE COMPONENT
                    this.dropzone.methods.move(container, afterElement)
                } else if (type && this.isDraggingNewComponent) {
                    // CREATE NEW COMPONENT
                    const component = this.components
                        .create(
                            type, undefined, undefined,
                            afterElement ? null : container
                        )!; // Append to end

                    if (afterElement)
                        container.insertBefore(component, afterElement);
                    this.components.select(component)
                }

                this.isDraggingNewComponent = false
            },

            move: (container: HTMLElement, afterElement: HTMLElement) => {
                // SELECT DRAGINNG COMPONENT
                let component = this.select('.component.dragging') as HTMLElement | null;
                if (!component) return this.dispatch('canvas:component:dragging', { container, afterElement });

                if (afterElement) container.insertBefore(component, afterElement);
                else { container.appendChild(component); }

                component.style.position = 'static';
                component.style.left = '';
                component.style.top = '';
            },

            canvas: (e: DragEvent, selector: string = '[data-dropzone-id]') => {
                let dropzone: HTMLElement | null = null;
                // USE COMPOSEDPATH (more robust for nested targets)
                if (typeof e.composedPath === 'function') {
                    const path = e.composedPath();
                    dropzone = path.find((el) =>
                        el instanceof HTMLElement && el.matches(selector)
                    ) as HTMLElement | undefined || null;
                }

                // Fallback to closest if necessary
                if (!dropzone && e.target instanceof HTMLElement) {
                    dropzone = e.target.closest(selector);
                }

                return dropzone
            }
        },

        handlers: {
            dropover: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                if (e.dataTransfer?.types.includes('text/plain')) {
                    e.preventDefault();
                    this.dropzone.methods.dragover(canvas, e.clientY)
                }
            },
            dragleave: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                this.dropzone.methods.resetDropHighilght(canvas)
            },
            drop: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                e.preventDefault();
                this.dropzone.methods.resetDropHighilght(canvas)
                this.dropzone.methods.drop(canvas, e)
            },
            click: (e: any) => {
                const canvas = e.target?.closest('[data-dropzone-id]');
                if (e.target === canvas) {
                    if (this.selectedComponent) {
                        this.components.select(null)
                    }
                }
            }
        },

        hooks: {
            start: () => {
                // SET LISTENERS
                const LISTENERS_MAP = this.baseEventListeners;

                this.eventListeners = [
                    // @ts-ignore
                    ...this.eventListeners,
                    ...LISTENERS_MAP
                ];
            }
        }
    }

    protected components = {
        /**
         * Create a new editor component
         * @param {string} type - Component type (heading, paragraph, etc.)
         * @param {number} [x] - Optional x position for absolute positioning
         * @param {number} [y] - Optional y position for absolute positioning
         * @param {HTMLElement} [parentElement] - Optional parent container
         * @returns {HTMLElement} The created component
         */
        create: (
            type: string,
            x?: number, y?: number,
            parentElement: HTMLElement | null = null,
            attrs: Record<string, any> = {}
        ) => {
            // CREATE COMPONENT ELEMENT
            var component = document.createElement('editor-component')
            component.setAttribute('type', type);
            // SET EMPTY DEFAULTS
            ["properties", "styles", "sub-elements", "attr-definition", "id"]
                .forEach(attr => {
                    let val = attrs[attr] || '';
                    typeof val !== 'string' ? val = JSON.stringify(val) : null;
                    component.setAttribute(attr, val)
                })

            // ADD TO PARENT
            if (parentElement) parentElement.appendChild(component);
            return component
        },

        select: (component: HTMLElement | null) => {
            // REMOVE SELECTED CLASS
            this.selectedComponent?.classList.remove('selected');
            this.selectAll('.selected')?.forEach(el => {
                el.classList.remove('selected')
            })

            // SELECT COMPONENT
            this.selectedComponent = component;
            this.dispatch('canvas:component:selected', { component: component })
            component?.classList.add('selected');
        },

        handlers: {
            dragstart: (e: any) => {
                e.stopPropagation();
                const comp = e.target.closest('.component')
                this.components.select(comp);
                comp.classList.add('dragging');
                e.dataTransfer.setData('text/plain', 'move');
                e.dataTransfer.effectAllowed = 'move';
                this.isDraggingNewComponent = false;
            },

            dragend: (e: any) => {
                // e.stopPropagation();
                const comp = e.target.closest('.component')
                comp.classList.remove('dragging');
            },

            click: (e: any) => {
                const comp = e.target.closest('.component')
                if (e.target.closest('.component-btn')) return;
                e.stopPropagation();
                this.components.select(comp);
            }
        }
    }

    protected baseEventListeners: EventListeners = [
        // CLICK CANVAS - DESELECT COMPONENTS
        ['[data-dropzone-id]', 'click', this.dropzone.handlers.click],
        [window, 'canvas:component:deselect', () => this.components.select(null)],
        // CANVAS - COMPONENT LISTENERS
        ["#canvas", 'dragover', this.dropzone.handlers.dropover],
        ["#canvas", 'dragleave', this.dropzone.handlers.dragleave],
        ["#canvas", 'drop', this.dropzone.handlers.drop],
        // CANVAS EVENTS
        [window, 'canvas:component:dragstart', (e) => {
            this.isDraggingNewComponent = e.detail.isDraggingNewComponent
        }],
        [window, 'canvas:component:selected', (e) => {
            this.selectedComponent = e.detail.component
        }],
    ]

    protected handlers = {
        hooks: {
            start: () => {
                // DEFINE REACTIVE
                var REACTIVE_MAP = this.DEFAULT_REACTIVE;
                if (this.reactive)
                    REACTIVE_MAP = [
                        ...this.DEFAULT_REACTIVE,
                        ...this.reactive
                    ]

                this.dropzone.hooks.start();
            }
        }
    }

}