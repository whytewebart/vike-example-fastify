import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { EditorCanvasBase } from '../base/canvas';

import componentCss from '../styles/component.css?inline'
import resetcss from "@unocss/reset/tailwind-compat.css?inline"

import { nanoid } from 'nanoid';
// import gsap from 'gsap';
import templating from './utils/templating';
type EventDetail = Event & { detail: any }

export interface EditorComponent {
    properties: Record<string, any>;
    type: string,
    styles: Record<string, string>;
    definition: ComponentDefinition | null;
    capabilities: ComponentCapabilities;
    subElements?: ComponentInstance['subElements'],
    entry?: DB.Session
}

export class EditorComponent extends EditorCanvasBase {
    options = { cssReset: false }
    attrs?: Attrs = [
        'sub-elements',
        'properties',
        'styles',
        'type',
        ['capabilities', {}]
    ]

    reactive: Reactive = ['entry', 'definition']
    static observedAttributes = ['properties', 'styles', 'sub-elements']

    camelToKebab(str: string): string {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    get styleGetter() {
        var hostCss = `:host { `

        const styleString = Object.entries({
            ...((this.definition?.styleSettings?.defaultStyles) || {}),
            ...((this.styles) || {})
        })
            .map(([key, value]) => {
                const entry = `${this.camelToKebab(key)}: ${value};`
                if (['width', 'height'].includes(key)) {
                    hostCss += entry
                };

                return entry
            })
            .join(' ');

        hostCss += ' }'
        // const stylestring = `:host > [styles="host"] { ${styleString} }`
        const stylestring = `[styles="host"] { ${styleString} }`

        return `${hostCss}
        ${stylestring}
        `
    }

    get subStyleGetter() {
        var payload = '';
        this.definition?.subElements?.forEach(({ key, selector }) => {
            payload += `${selector} {`;
            payload += Object.entries(this.subElements?.[key]?.styles || {})
                .map(([key, value]) => `${this.camelToKebab(key)}: ${value};`)
                .join(' ');
            payload += '}';
        })

        return payload
    }

    // DEFINE HANDLE HTML
    handle = /*html*/`
        <button
            id="handle"
            position="top">
                •••
        </button>

        <style ref="button-handle">
            button#handle {
                padding-top: 0.125rem; /* 2px */
                padding-bottom: 0.125rem; /* 2px */
                padding-left: 1.25rem; /* 20px */
                padding-right: 1.25rem; /* 20px */
                border-bottom-left-radius: 0.5rem; /* 8px */
                border-bottom-right-radius: 0.5rem; /* 8px */
                border-width: 1px;
                --un-border-opacity: 1;
                border-color: rgb(191 219 254 / var(--un-border-opacity));
                border-top-width: 0px;
                --un-bg-opacity: 1;
                background-color: rgb(243 244 246 / var(--un-bg-opacity)) /* #f3f4f6 */;
                width: fit-content;
                font-size: 0.75rem; /* 12px */
                line-height: 1rem; /* 16px */
                --un-text-opacity: 1;
                color: rgb(55 65 81 / var(--un-text-opacity)) /* #374151 */;
                font-family: "Space Mono";
                font-weight: 600;
                text-transform: capitalize;
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 150ms;
                pointer-events: auto;
                position: absolute;
                z-index: 1;
                top: -25px;
                left: 50%;
                --un-translate-x: -50%;
                transform: translateX(var(--un-translate-x)) translateY(var(--un-translate-y))
                    translateZ(var(--un-translate-z)) rotate(var(--un-rotate))
                    rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y))
                    rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y))
                    scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))
                    scaleZ(var(--un-scale-z));
            }
            button#handle:hover {
                border-top-width: 2px;
                --un-border-opacity: 1;
                --un-border-top-opacity: var(--un-border-opacity);
                border-top-color: rgb(129 140 248 / var(--un-border-top-opacity));
                --un-bg-opacity: 1;
                background-color: rgb(249 250 251 / var(--un-bg-opacity)) /* #f9fafb */;
                cursor: grab;
            }
        </style>
    `
    // EMPTY TEMPLATE
    template = () => /*html*/`
        <div class="placeholder skeleton-box"></div>
        <style>
        .skeleton-box {
            width: 100%;
            height: 40px;
            background: linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%);
            background-size: 400% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
        }

        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        </style>
    `

    html = () => /*html*/`
        ${this.type === 'dropzone' ? this.handle : ''}
        ${this.template()}
    `

    validation = {
        // CHECK IF PROPERTY ATTRIBUTES ARE VALID TO DEFINIIONS
        properties: () => {
            // EXTRACT KEYS
            const keys = Object.keys(this.properties);
            const definitionKeys = this.definition?.properties?.map(d => d.name) || [];

            // CHECK IF "keys" ARE VALID TO "definitionKeys"
            const invalidKeys = keys.filter(key => !definitionKeys.includes(key));
            if (invalidKeys.length > 0)
                console.warn('Invalid property keys:', invalidKeys);

            // CHECK FOR MISSING KEYS AND REPLACE WITH DEFAULT VALUES
            const missingKeys = definitionKeys.filter(key => !keys.includes(key));
            var propertiesToUpdate = { ...this.properties };
            // Remove invalid keys from properties
            invalidKeys.forEach(invalidKey => { delete propertiesToUpdate[invalidKey] });
            if (missingKeys.length > 0 && this.definition?.properties) {
                missingKeys.forEach(missingKey => {
                    const def = this.definition!.properties!
                        .find(d => d.name === missingKey);
                    if (def)
                        propertiesToUpdate = {
                            ...propertiesToUpdate,
                            [missingKey]: def.defaultValue
                        };
                });

                // Set default value for missing property
                this.setAttribute('properties', JSON.stringify(propertiesToUpdate));
                console.info('Added missing property keys with default values:', this.id, missingKeys);
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

            if (!canvas)
                return console.warn("Canvas not found during drop.");

            switch (action) {
                case "drop":
                    // Use capabilities attribute in canvas
                    capabilities = JSON.parse(canvas.getAttribute('capabilities'))

                    if (!capabilities) {
                        callback?.();
                        break;
                    }

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

    registerDefaults = async () => {
        if (!this.definition) return console.error('Definition not loaded');
        if (this.getAttribute('state') === "loaded") return;

        var storeOpts = {}

        // CONFIGURE ELEMENTS
        this.definition.subElements?.forEach(element => {
            const el = this.select(element.selector) as HTMLElement;
            // SET UP DROPZONE
            if (element.capabilities?.isContainer) {
                this.dropzone.setup(el)
                el?.setAttribute('dropzone', element.key)
                el?.setAttribute(
                    'capabilities',
                    JSON.stringify({ ...this.capabilities, ...element.capabilities })
                );

                if (this.entry && this.entry.dropzones[element.key]) {
                    el?.setAttribute('data-dropzone-id', this.entry.dropzones[element.key])
                }
            }
        });

        this.definition.defaultChildren?.map((componentDef) => {
            if (this.entry) return;
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
            component.id = nanoid()
            component.setAttribute('type', componentDef.type)
            component.setAttribute('properties', JSON.stringify(properties))
            component.setAttribute('capabilites', JSON.stringify(componentDef.capabilities || {}));
            component.setAttribute('styles',
                JSON.stringify(componentDef.styleSettings?.defaultStyles))

            /*html
            `
                <editor-component
                    type='${componentDef.type}'
                    properties='${JSON.stringify(properties || [])}'
                    styles='${JSON.stringify(componentDef.styleSettings?.defaultStyles)}'
                    attr-definition='${JSON.stringify(componentDef)}'
                >
                </editor-component>
            `*/
            // GET SELECTOR IF AVAILABLE
            const container = this.select(componentDef.selector || "[dropzone='']");
            container?.appendChild(component);
        });

        // SET UP GLOBL DROPONE
        if (this.definition.capabilities?.isContainer === true) {
            const dropzone = this.select('[dropzone=""]')
            dropzone?.setAttribute('capabilities', JSON.stringify(this.capabilities));
            this.dropzone.setup(dropzone!)
            if (this.entry && this.entry.dropzones['default']) {
                dropzone?.setAttribute('data-dropzone-id',
                    this.entry.dropzones['default'])
            }
            
            // APPEND SLOT CONTENT TO DROPZONE
            const slot = <HTMLSlotElement>this.select("slot");
            if (slot) {
                const nodes = slot.assignedElements({ flatten: true });
                nodes.forEach(el => {
                    dropzone?.appendChild(el)
                    setTimeout(() => {
                        this.dispatch(`component:${el.id}:state:load`, {
                            force: true
                        })
                    }, 1000)
                })
            }
        }



        // SET PROPERTIES
        templating.evaluateSyntax({ properties: this.properties }, this)
        // SET STATE TO LOADED
        this.setAttribute('state', 'loaded')
        // ADD REACTIVE LISTENERS
        this.propertyListeners();
        // LOAD STORE
        this.dispatch(`component:${this.id}:state:load`)
    }

    store = async (force: boolean = false) => {
        // OPEN DATABASE
        await Promise.all([this.session.open(), this.space.open()]);
        // GET KEY
        const key = `component-${this.type}-${this.id}`
        const dropzone = this.closest('[data-dropzone-id]')
        const children = Array.from(dropzone?.children || []);
        const index = children.indexOf(this);
        const session = (await this.space.findByIndex('latest', "true"))[0];

        if (!this.entry || force) {
            if (!session) return;
            // CREATE ENTRY
            const payload = {
                key,
                id: this.id,
                type: this.type,
                properties: this.properties,
                sessionId: session.id,
                index,
                order: index,
                styles: this.styles
            };

            // @ts-ignore GET DROPZONE ROOT ELEMENT
            // const dropzoneEl = dropzone?.getRootNode().host as HTMLElement;
            // console.log(this.selectAll('[data-dropzone-id]'))
            const dropzones_ = Array.from(this.selectAll('[data-dropzone-id]') || []);
            const dropzones: Record<string, string> = {};

            dropzones_.forEach(el => {
                var name = el.getAttribute('dropzone')!;
                name = name === '' ? 'default' : name;
                dropzones[name] = el.getAttribute('data-dropzone-id')!
            })

            await this.session[force ? 'update' : 'add']({
                ...payload,
                dropzone: dropzone?.getAttribute('data-dropzone-id')!,
                dropzones,
            })
        }

        // LOAD NESTED ELEMENTS
        Array.from(this.selectAll('[data-dropzone-id]') || [])
            .forEach(async el => {
                const dropzoneId = el.getAttribute('data-dropzone-id');
                const query = IDBKeyRange.only([session.id, dropzoneId])
                await this.session.findByIndex("sessionId", query).then(response => {
                    response
                        .sort((a, b) => a.order - b.order)
                        .map(ent => {
                            // CHECK IF ELEMENT WITH ID EXISTS
                            // TO AVOID DUPLICATES
                            if (this.select(`[id="${ent.id}"]`)) return;
                            const rootElement = this.select(`[data-dropzone-id="${ent.dropzone}"]`);

                            const component = this.components.create(ent.type, undefined, undefined, undefined, {
                                properties: ent.properties,
                                id: ent.id,
                                "sub-elements": ent?.subElements,
                                styles: ent?.styles
                            });

                            rootElement?.appendChild(component)
                        })
                })
            })

        // CHECK IF COMPONENT HAS CHANGED DROPZONE
        if (this.entry && (this.entry?.dropzone !== dropzone?.getAttribute('data-dropzone-id'))) {
            this.session.update({
                ...this.entry,
                dropzone: dropzone?.getAttribute('data-dropzone-id')!
            })

            this.setAttribute('state', 'indexchanged')
            this.dispatch('components:reorder', {
                component: this
            })
        }

        // CHECK IF INDEX and ENTRY INDEX MATCH
        if (this.entry && (this.entry?.index !== index)) {
            // if state is indexchanged don't run
            if (this.getAttribute('state') === "indexchanged") return;
            // UPDATE ENTRY
            this.setAttribute('state', 'indexchanged')
            this.dispatch('components:reorder', {
                component: this
            })
        }
    }

    async beforeRender() {
        var _definition;
        // IF DEFINITION IS LOADED STOP
        if (this.definition) return;

        // IMPORT DEFINITION
        _definition = await import('@/quickinvoice/definition/components');
        this.definition = Object.values(_definition.default)
            .find(def => def.type == this.type)!;

        // DEFINITION NOT LOADED STOP
        if (!this.definition) {
            window.alert('Component definition not found')
            console.error('Definition not found');
            return
        }

        // VALIDATE PROPERTIES
        this.validation.properties();
        // SET COMPONENT CAPABILITIES
        const capabilities = { ...this.definition?.capabilities, ...this.capabilities };
        this.setAttribute('capabilities', JSON.stringify(capabilities));
        // REMOVE REACTIVITY
        this.template = (() => this.definition!.renderTemplate!(this.properties));
        this.dataset.type = this.definition?.type?.toLowerCase() || 'unknown';
        this.dataset.name = this.definition.name
    }

    async onReady() {
        // CHECK DEFINITION WAS LOADED
        if (!this.definition) {
            console.error('Definition not loaded');
            this.remove()
            return;
        };
        // CHECK IF STATE WAS SET BEFORE
        if (!this.getAttribute('state')) {
            // console.log("RERENDER from onReady")
            this.rerender();
        }
        // COMPONENT IS NOW READY
        this.setAttribute('state', 'ready')
    }

    onDestroy() {
        // COMPONENT HAS BEEN DESTROYED
        console.log(this.id, "destroyed")
    }

    async afterRender() {
        if (!this.definition) return;
        // OPEN DATABASE
        await this.session.open()
        await this.session.get(this.id)
            .then(async response => {
                // UPDATE ENTRY
                this.entry = response;
                // REGISTER DEFAULTS
                await this.registerDefaults();
            })

        // console.log(this.type, this.id, "rerenderd", this.dataset.type)
    }

    async onStart() {
        this.id = this.id || nanoid();
        this.classList.add('component');
        this.draggable = true;
    }

    privateCss = () => /*css*/`
        ${this.definition?.styleSettings?.css?.(this.properties)}
        :host { position: relative !important; overflow-y: clip; }
        ${this.styleGetter}

        ${this.subStyleGetter}
    `

    css = () => {
        // console.log(this.subStyleGetter)
        return /*css*/`
            ${resetcss}
            ${componentCss}
            ${this.privateCss()}
        `;
    }

    canvas = {
        methods: {
            dragstart: (e: any) => this.isDraggingNewComponent = e.detail.isDraggingNewComponent,
            selected: (e: any) => {
                this.selectedComponent = e.detail.component
            },
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
                const c = (canvas.getRootNode() as unknown as any).host
                const capabilities = JSON.parse(canvas.getAttribute('capabilities') || '{}')

                /* IF CONTAINER USE GSAP TO ADD BOTTOM HEIGHT TO "this" */              if (capabilities?.isContainer) {
                    // this.dispatch(`container:resize:dragover:${window?.stretchDropzone}`)
                    if (window.stretchDropzone !== c.id) {
                        // if (canvas.getAttribute('stretch-dropzone') !== 'stretch' || window.stretchDropzone !== c.id) {
                        window.stretchDropzone = c.id;
                        useGsap(({ gsap }) => {
                            gsap.to(canvas, {
                                height: '+=20',
                                duration: .2,
                                backgroundColor: 'rgba(85, 147, 247, 0.03)',
                                attr: {
                                    "stretch-dropzone": "stretch"
                                }
                            });
                        })
                    }
                }

                // ================
                if (e.dataTransfer?.types.includes('text/plain')) {
                    e.preventDefault();
                    this.dropzone.methods.dragover(canvas, e.clientY)
                }
            },
            dragleave: (e: any) => {
                e.stopPropagation();
                const canvas = this.dropzone.methods.canvas(e)!;
                this.dropzone.methods.resetDropHighilght(canvas);
                // ====================================
                if (this.id !== window.stretchDropzone) return;
                this.dispatch(`container:resize:dragover:${window.stretchDropzone}`)
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
                    /* REMOVE SPACE */
                    this.dispatch(`container:resize:dragover`);
                })
            },
        }
    }

    propertyListeners() {
        const handlers = {
            update: async (e: EventDetail) => {
                const data: Record<string, any> = e.detail.data;
                // EXTRACT KEYS
                const keys = Object.keys(data);
                const definitionKeys = this.definition?.properties?.map(d => d.name) || [];

                // CHECK IF "keys" ARE VALID TO "definitionKeys"
                const invalidKeys = keys.filter(key => !definitionKeys.includes(key));
                if (invalidKeys.length > 0) {
                    console.warn('Invalid property keys:', invalidKeys);
                }

                // UPDATE PROPERTIES
                const properties = (() => {
                    const updatedProperties = { ...this.properties };
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const propDef = this.definition?.properties?.find(p => p.name === key);
                            if (propDef) {
                                if (typeof propDef.type === 'object' && propDef.type.type === 'array') {
                                    // Handle array type: append new entry
                                    var currentArray = Array.isArray(updatedProperties[key]) ? updatedProperties[key] : [];
                                    const newItem = data[key];

                                    if (newItem && typeof newItem === 'object' && 'id' in newItem) {
                                        const index = currentArray.findIndex(item => item.id === newItem.id);

                                        // if action is 'delete', remove the item
                                        if (e.detail.action === 'delete') {
                                            currentArray = currentArray.filter(item => item.id !== newItem.id);
                                        }
                                        else if (index !== -1) {
                                            // Update existing item
                                            currentArray[index] = { ...currentArray[index], ...newItem };
                                        } else {
                                            // Add new item
                                            currentArray.push(newItem);
                                        }
                                    } else {
                                        // Fallback: just push if there's no id to match on
                                        currentArray.push(newItem);
                                    }

                                    updatedProperties[key] = currentArray;
                                } else {
                                    // Handle other types: direct update
                                    updatedProperties[key] = data[key];
                                }
                            }
                        }
                    }
                    return updatedProperties;
                })();

                // console.log('Updated properties:', properties, uniqueId)
                // return;

                templating.evaluateSyntax({ properties }, this);
                this.setAttribute('properties', JSON.stringify(properties));

                if (!this.entry) {
                    this.entry = await this.session.get(this.id)
                }

                await this.session.update({
                    ...this.entry!,
                    properties
                })

                // RERENDER EDITOR COMPONENT
                this.dispatch(`editor-input:${this.id}-${Object.keys(data)[0]}:rerender`)
            },
            updateStyles: async (e: EventDetail) => {
                // VALIDATE KEYS BY DEFINITION
                const keys = Object.keys(e.detail);
                const definitionKeys = this.definition?.subElements?.flatMap(el => el.key);

                // CHECK IF "keys" ARE VALID TO "definitionSubEMlements"
                const invalidKeys = keys.filter(key => !definitionKeys?.includes(key) && key !== "host");
                if (invalidKeys.length > 0) {
                    console.warn('Invalid sub-element keys:', invalidKeys);
                }

                // LOOP VALID KEYS
                for (const key in e.detail) {
                    // IF DEFINITION_KEYS HAS PROPERTY
                    if (!definitionKeys?.includes(key) && key !== 'host')
                        continue;

                    if (!this.entry) {
                        this.entry = await this.session.get(this.id)
                    }

                    // IF KEY IS HOST
                    if (key === 'host') {
                        const styles = {
                            ...this.styles,
                            ...e.detail[key]
                        };

                        this.setAttribute('styles', JSON.stringify(styles));
                        await this.session.update({
                            ...this.entry!,
                            styles
                        })

                        continue;
                    }

                    // ELSE UPDATE THE SUB_ELEMENTS ACCORDINGLY
                    const payload = {
                        ...this.subElements,
                        [key]: {
                            ...this.subElements?.[key],
                            styles: {
                                ...this.subElements?.[key]?.styles,
                                ...e.detail[key]
                            }
                        }
                    }

                    this.setAttribute('sub-elements', JSON.stringify(payload));
                    await this.session.update({
                        ...this.entry!,
                        subElements: payload
                    })
                }
            },
            resizeDragover: () => {
                const getDragover = this.selectAll('[stretch-dropzone="stretch"]');
                getDragover?.forEach(el => {
                    useGsap(({ gsap }) => {
                        gsap.to(el, {
                            height: 'auto',
                            backgroundColor: '',
                            onComplete: () => {
                                el.removeAttribute('stretch-dropzone');
                            },
                            duration: .2,
                        });
                    })
                })

                window.stretchDropzone = undefined;
            },
            select: () => {
                this.components.select(this)
            }
        };
        // ADD LISTENERS
        Minze.listen(`container:resize:dragover:${this.id}`, handlers.resizeDragover)
        Minze.listen(`container:resize:dragover`, handlers.resizeDragover)
        Minze.listen(`component:${this.id}:styles`, handlers.updateStyles)
        Minze.listen(`component:${this.id}:rerender`, () => this.rerender())
        Minze.listen(`component:${this.id}:properties`, handlers.update)
        Minze.listen(`component:${this.id}:select`, handlers.select)
        Minze.listen(`component:${this.id}:state:load`, async (event: EventDetail) => {
            // console.log("Loading component state for", this.id, event.detail);
            // SAVE TO LOCAL STORAGE
            await this.store(event.detail?.force);
        })
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

        [
            this,
            'mouseenter',
            () => {
                const handle = this.select('#handle');
                if (!handle) return;
                useGsap(({ gsap }) => {
                    gsap.to(handle, {
                        top: "0px",
                        duration: .2 // seconds,
                    });
                })
            }
        ],

        [
            this,
            'mouseleave',
            () => {
                const handle = this.select('#handle');
                if (!handle) return;
                useGsap(({ gsap }) => {
                    gsap.to(handle, {
                        top: '-22px',
                        duration: .2 // seconds'
                    });
                })
            }
        ]

    ]
}