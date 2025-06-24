import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { CardDef } from './map'
import { EditorCanvasBase } from '../canvas/base';

import componentCss from '../styles/canvas.component.css?inline'
import { nanoid } from 'nanoid';
import { e } from 'unocss';
type EventDetail = Event & { detail: any }

export interface EditorComponent {
    attrDefinition: ComponentInstance;
    properties: Record<string, string>[];
    type: string,
    styles: Record<string, string>;
    definition: ComponentDefinition | null;
    capabilities: ComponentCapabilities;
    override?: {
        definition: boolean
    }
}

export class EditorComponent extends EditorCanvasBase {
    options = { cssReset: true }
    definition: ComponentDefinition | null = null;
    attrs?: Attrs = [
        'attr-definition',
        'properties',
        'styles',
        'type',
        'override',
        ['capabilities', {}]
    ]

    reactive: Reactive = []
    static observedAttributes = ['properties', 'styles']

    html = () => /*html*/`<h1>Editor Component initializing...</h1>`

    validation = {
        // CHECK IF PROPERTY ATTRIBUTES ARE VALID TO DEFINIIONS
        properties: () => {
            // EXTRACT KEYS
            const keys = Object.keys(this.properties);
            const definitionKeys = this.definition?.properties?.map(d => d.name) || [];

            // CHECK IF "keys" ARE VALID TO "definitionKeys"
            const invalidKeys = keys.filter(key => !definitionKeys.includes(key));
            if (invalidKeys.length > 0) {
                console.warn('Invalid property keys:', invalidKeys);
            }

            // CHECK FOR MISSING KEYS AND REPLACE WITH DEFAULT VALUES
            const missingKeys = definitionKeys.filter(key => !keys.includes(key));
            if (missingKeys.length > 0 && this.definition?.properties) {
                missingKeys.forEach(missingKey => {
                    const def = this.definition!.properties!
                        .find(d => d.name === missingKey);
                    if (def) {
                        const properties: typeof this.properties = {
                            ...this.properties, [missingKey]: def.defaultValue
                        };
                        // Remove invalid keys from properties
                        invalidKeys.forEach(invalidKey => {
                            // @ts-ignore
                            delete properties[invalidKey];
                        });

                        // Set default value for missing property
                        this.setAttribute('properties', JSON.stringify(properties));
                    }
                });
                console.info('Added missing property keys with default values:', missingKeys);
            }
        },

        // CHECK IF COMPONENT ACCEPTS NESTED
        nested: (
            action: "move" | "drop" | "delete",
            event: Event & { [key: string]: any },
            callback?: () => void
        ) => {
            // Ensure canvas is returned correctly
            const canvas = event.canvas;
            var capabilities = this.capabilities;

            if (!canvas) {
                console.warn("Canvas not found during drop.");
                return;
            }

            switch (action) {
                case "drop":
                    // Use capabilities attribute in canvas
                    capabilities = JSON.parse(canvas.getAttribute('capabilities'))
                    // Check if component can have children at all
                    if (
                        capabilities.canHaveChildren === false ||
                        capabilities.isContainer === false
                    ) {
                        return;
                    }

                    // Check children limit
                    if (
                        typeof capabilities.canHaveChildren === "number" &&
                        canvas.children.length >= capabilities.canHaveChildren
                    ) {
                        console.warn("Children limit exceeded.");
                        return;
                    }

                    callback?.();
                    break;

                case "move":
                    // Use capabilities attribute in canvas
                    capabilities = JSON.parse(canvas.getAttribute('capabilities'));
                    if (capabilities?.childrenLocked && capabilities.childrenLocked === true) {
                        console.warn("Reordering is locked on component")
                        return
                    };
                    callback?.();
                    break;

                case "delete":
                    if (capabilities?.canBeDeleted === false) return;
                    callback?.();
                    break;

                default:
                    console.warn(`Unknown action: ${action}`);
                    break;
            }
        }
    }

    regsiterDefaults = () => {
        if (!this.definition) return console.error('Definition not loaded');
        this.definition.defaultChildren?.map((componentDef) => {
            // GET PROPERTIES ARRAY
            const _properties = componentDef.properties?.map(d => {
                const obj: Record<string, string> = {};
                obj[d.name] = d.defaultValue

                return obj
            }) || []
            // JOIN PROPERTIES INTO ONE OBJECT
            const properties = Object.assign({}, ..._properties)

            // CREATE COMPONENT
            const component = document.createElement('editor-component');
            component.setAttribute('type', componentDef.type)
            component.setAttribute('properties', JSON.stringify(properties))
            component.setAttribute('attr-instance', JSON.stringify(componentDef));
            component.setAttribute('capabilites', JSON.stringify(componentDef.capabilities || {}));
            component.setAttribute('styles',
                JSON.stringify(componentDef.styleSettings?.defaultStyles))

            /*html
            `
                <editor-component
                    type='${componentDef.type}'
                    properties='${JSON.stringify(properties || [])}'
                    styles='${JSON.stringify(componentDef.styleSettings?.defaultStyles)}'
                    attr-instance='${JSON.stringify(componentDef)}'
                >
                </editor-component>
            `*/
            // GET SELECTOR IF AVAILABLE
            const container = this.select(componentDef.selector || "[dropzone='']");
            container?.appendChild(component);
        });

        // CONFIGURE ELEMENTS
        this.definition.subElements?.forEach(element => {
            const el = this.select(element.selector) as HTMLElement;
            // SET UP DOPZONE
            if (element.capabilities?.isContainer) {
                el?.setAttribute('capabilities', JSON.stringify({ ...this.capabilities, ...element.capabilities }));
                el?.setAttribute('dropzone', element.key)
                this.dropzone.setup(el)
            }
        })
    }

    async onReady() {
        if (this.override?.definition && typeof this.attrDefinition !== 'object')
            return console.error('Invalid component instance');

        // IMPORT DEFINITION
        const _definition = await import('./definition');
        // @ts-ignore
        this.definition = _definition.default[this.type];
        // RUN VALIDATORS
        this.validation.properties();
        const capabilities = { ...this.definition?.capabilities, ...this.capabilities }
        this.setAttribute('capabilities', JSON.stringify(capabilities));

        this.html = (() => this.definition!.renderTemplate!(this.properties));

        this.rerender();
    }

    afterRender() {
        // REGISTER DEFAULT ELEMENTS
        this.regsiterDefaults();
    }

    onStart() {
        this.id = nanoid();
        this.classList.add('component');
        this.draggable = true;
        this.dataset.type = this.type
    }

    css = () => {
        const styleString = Object.entries({
            ...((this.definition?.styleSettings?.defaultStyles) || {}),
            ...((this.styles) || {})
        })
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ');
        return /*css*/`
            :host { ${styleString} }
            ${this.definition?.styleSettings?.css?.(this.properties)}
            ${componentCss}
        `;
    }

    canvas = {
        methods: {
            dragstart: (e: any) => this.isDraggingNewComponent = e.detail.isDraggingNewComponent,
            selected: (e: any) => this.selectedComponent = e.detail.component,
            dragging: (e: EventDetail) => {
                const { container, afterElement } = e.detail;
                let component = this.select('.component.dragging') as HTMLElement || this.selectedComponent;

                if (afterElement) container.insertBefore(component, afterElement);
                else container?.appendChild(component);

                component.style.position = 'static';
                component.style.left = '';
                component.style.top = '';
            }
        },

        dropzone: {
            dropover: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                // ================
                if (e.dataTransfer?.types.includes('text/plain')) {
                    e.preventDefault();
                    this.dropzone.methods.dragover(canvas, e.clientY)
                }
            },
            dragleave: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                // ====================================
                this.dropzone.methods.resetDropHighilght(canvas)
            },
            drop: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                var type = e.dataTransfer?.getData('text/plain');

                type = type === 'move' ? 'move' : 'drop';
                e.canvas = canvas

                // VALIDATE
                this.validation.nested(type, e, () => {
                    e.preventDefault();
                    this.dropzone.methods.resetDropHighilght(canvas)
                    this.dropzone.methods.drop(canvas, e)
                })
            },
        }
    }



    componentListeners: EventListeners = [
        [this, 'click', this.components.handlers.click],
        [this, 'dragstart', this.components.handlers.dragstart],
        [this, 'dragend', this.components.handlers.dragend],
    ]

    canvasListeners: EventListeners = [
        [window, 'canvas:component:dragstart', this.canvas.methods.dragstart],
        [window, 'canvas:component:selected', this.canvas.methods.selected],
        [window, 'canvas:component:dragging', this.canvas.methods.dragging]
    ]

    eventListeners?: EventListeners = [
        ...this.componentListeners,
        ...this.canvasListeners,

        [this, 'dragover', this.canvas.dropzone.dropover],
        [this, 'dragleave', this.canvas.dropzone.dragleave],
        [this, 'drop', this.canvas.dropzone.drop],
    ]
}