import { Attrs, EventListeners, MinzeElement, Reactive } from 'minze'
import { nanoid } from 'nanoid';

export interface EditorCanvasBase {
    selectedComponent: HTMLElement | null;
    isDraggingNewComponent: boolean;
    // components: HTMLElement[]
}

const cardInstance: ComponentInstance = {
    id: 'card-123',
    type: 'card',
    childrenIds: ['btn-save-456', 'btn-cancel-789', 'text-101'],

    properties: {
        title: 'User Settings',
        description: 'Update your profile information',
        showFooter: true
    },

    styles: {
        'background-color': '#f8f9fa',
        'width': '400px'
    },

    subElements: {
        header: {
            styles: {
                'padding': '16px',
                'border-bottom': '1px solid #eee'
            }
        },
        body: {
            styles: {
                'padding': '24px'
            }
        },
        footer: {
            styles: {
                'padding': '16px',
                'border-top': '1px solid #eee'
            }
        }
    },

    meta: {
        visible: true,
        updatedAt: '2023-05-20T10:00:00Z',
        createdAt: '2023-05-20T10:00:00Z',
    }
};

/**
 * EDITOR CANVAS BASE CLASS
 * Contains core drag-and-drop functionality and editor state management
 * Extend this class to create custom editor implementations
 */
export class EditorCanvasBase extends MinzeElement {
    // ======================
    // REACTIVE PROPERTIES
    // ======================
    protected DEFAULT_REACTIVE: Reactive = [
        ['selectedComponent', null],  // Currently selected component
        ['isDraggingNewComponent', false], // Flag for new component drag
        // ['components', []] // Array to track all components (optional)
    ]

    // ======================
    // ATTRIUTES
    // ======================
    // attrs: Attrs = []

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
        setup: (canvas?: HTMLElement) => {
            const dropzoneId = nanoid()
            if (!canvas) {
                canvas = this.select(`[data-dropzone-id=${this.CANVAS_ID}]`) as HTMLElement
            }

            if (!canvas.getAttribute('data-dropzone-id'))
                canvas.setAttribute('data-dropzone-id', dropzoneId);

            // console.log(canvas)
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
                const placeholder = container.querySelector('.component-placeholder')

                // console.log(container, placeholder)

                // Highlight placeholder if empty container
                if (placeholder && container.children.length === 1) {
                    placeholder.classList.add('highlight')
                } else {
                    // Show insertion indicator for non-empty containers
                    const afterElement = this.dropzone.methods.dragafter(container, clientY)
                    const components = Array.from(container.children)
                        .filter(el => el.classList.contains('component'));
                    // @ts-ignore
                    components.forEach(c => c.style.borderTop = '')
                    if (afterElement) {
                        afterElement.style.borderTop = '2px solid #4CAF50'
                    }
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
                // GET DROPZONE ID
                const dropzoneId = container.getAttribute('data-dropzone-id');
                const placeholderSelector = `[data-dropzone-id="${dropzoneId}"] > .component-placeholder`

                const placeholder = container.querySelector(placeholderSelector);
                if (dropzoneId && placeholder) placeholder.classList.remove('highlight');

                const afterElement = this.dropzone.methods.dragafter(container, e.clientY)

                // console.log('dropped', type, container, dropzoneId, this.isDraggingNewComponent, afterElement)

                if (type === 'move') {
                    // Handle moving existing component
                    this.dropzone.methods.move(container, afterElement)
                } else if (type && this.isDraggingNewComponent) {
                    // Handle creating new component
                    // New component - only create if dragging from toolbox
                    const component = this.components
                        .create(
                            type, undefined, undefined,
                            afterElement ? null : container
                        )!; // Append to end

                    // console.log(component)

                    if (afterElement) {
                        container.insertBefore(component, afterElement);
                    }

                    // Remove placeholder if it exists
                    if (dropzoneId && placeholder && container.querySelector('.component')) {
                        placeholder.remove();
                    }
                }

                this.isDraggingNewComponent = false
            },

            move: (container: HTMLElement, afterElement: HTMLElement) => {
                // GET DROPZONE ID
                const dropzoneId = container.getAttribute('data-dropzone-id');
                const placeholderSelector = `[data-dropzone-id="${dropzoneId}"] > .component-placeholder`

                const placeholder = container.querySelector(placeholderSelector);
                if (dropzoneId && placeholder) placeholder.classList.remove('highlight');

                // console.log("moving...", this.select('.component.dragging'), container)

                // Moving existing component
                let component = this.select('.component.dragging') as HTMLElement | null;
                if (!component) return this.dispatch('canvas:component:dragging', { container, afterElement });

                // console.log(component, afterElement)

                if (afterElement) {
                    container.insertBefore(component, afterElement);
                } else {
                    container.appendChild(component);
                }

                // Remove placeholder if it exists
                if (dropzoneId && placeholder && container.querySelector('.component')) {
                    placeholder.remove();
                }

                component.style.position = 'static';
                component.style.left = '';
                component.style.top = '';
            },

            canvas: (e: DragEvent, selector: string = '[data-dropzone-id]') => {
                let dropzone: HTMLElement | null = null;

                // Try composedPath (more robust for nested targets)
                if (typeof e.composedPath === 'function') {
                    const path = e.composedPath();
                    dropzone = path.find((el) =>
                        // el instanceof HTMLElement && el.hasAttribute(selector)
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
                // console.log("----------- 02")
                // const canvas = e.target?.closest('[data-dropzone-id]');
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                // ================
                if (e.dataTransfer?.types.includes('text/plain')) {
                    e.preventDefault();
                    this.dropzone.methods.dragover(canvas, e.clientY)
                }
            },
            dragleave: (e: any) => {
                // const canvas = e.target?.closest('[data-dropzone-id]');
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                // ====================================
                this.dropzone.methods.resetDropHighilght(canvas)
            },
            drop: (e: any) => {
                // const canvas = e.target?.closest('[data-dropzone-id]');
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                // ================================================
                e.preventDefault();
                this.dropzone.methods.resetDropHighilght(canvas)
                this.dropzone.methods.drop(canvas, e)
            },
            click: (e: any) => {
                const canvas = e.target?.closest('[data-dropzone-id]');
                // console.log(canvas, e.target)

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
            parentElement: HTMLElement | null = null
        ) => {
            // Validate component type
            if (!this.BLOCK_TYPES.includes(type)) {
                console.warn(`Invalid component type: ${type}`)
                return null
            }

            // Create component container
            var component = document.createElement('div')
            component.className = 'component'
            component.draggable = true
            component.dataset.type = type;

            // Add content based on type
            this.components.define(component, type)

            if (type === 'test') {
                // @ts-ignore
                component = component.children[0]
            }

            // THIS LINE SHOULD BE ENABLED ON NON-EDITOR_COMPONENTS
            if (type !== 'test') {
                component.addEventListener('click', this.components.handlers.click);
                component.addEventListener('dragstart', this.components.handlers.dragstart);
                component.addEventListener('dragend', this.components.handlers.dragend);
            }

            // Add to parent or canvas
            if (parentElement) {
                parentElement.appendChild(component);
            } else {

                const canvas = this.select(`[data-dropzone-id=${this.CANVAS_ID}]`) as HTMLElement;
                // Position new component near the drop point
                if (x && y) {
                    const rect = canvas.getBoundingClientRect();
                    const relativeX = x - rect.left;
                    const relativeY = y - rect.top;

                    component.style.position = 'absolute';
                    component.style.left = `${relativeX}px`;
                    component.style.top = `${relativeY}px`;
                }
                // canvas.appendChild(component);
            }

            this.components.select(component);
            return component
        },

        // Add content based on type
        define: (component: HTMLElement, type: string) => {
            const store: Record<string, string> = {
                heading: '<h2 contenteditable="false">Heading</h2>',
                paragraph: '<p contenteditable="false">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
                image: '<img src="https://via.placeholder.com/300x200" style="max-width:100%;">',
                button: '<button style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px;">Button</button>',
                container: `<div dropzone class="component-container"><div class="component-placeholder">Drop components here</div></div>`,
                test: `<editor-component
                    type='${cardInstance.type}'
                    properties='${JSON.stringify(cardInstance.properties)}'
                    styles='${JSON.stringify(cardInstance.styles)}'
                    subElements='${JSON.stringify(cardInstance.subElements)}'
                    attr-instance='${JSON.stringify(cardInstance)}'
                    data-type='${type}'
                ></editor-component>`
            }

            component.innerHTML += store[type];
            component
                .querySelectorAll('[dropzone]')
                .forEach((e: any) => this.dropzone.setup(e));
        },

        select: (component: HTMLElement | null) => {
            // console.log(component, this.selectedComponent)
            // REMOVE SELECTED CLASS
            this.selectedComponent?.classList.remove('selected');
            this.selectAll('.selected')?.forEach(el => {
                el.classList.remove('selected')
            })

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