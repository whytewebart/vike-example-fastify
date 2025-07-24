import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { IndexedDBWrapper } from '../component/utils/state';
import Compressor from 'compressorjs';
import { nanoid } from "nanoid"

export interface EditorInput {
    type: PropertyType; // Type of the input (text, number, select, etc.)
    label: string;
    selectOptions: string[];
    checked: boolean;
    defaultValue?: any;
    componentId?: string;
    description?: string; // Description for the input
    helptext?: string; // Help text for the input
    repeater?: string; // Whether the input is a repeater
    entries: any[];
    entryId: string;
    nested: boolean; // Whether the input array is nested
}

export class EditorInput extends MinzeElement {
    DB_VERSION = 1;
    DB_NAME = 'quickinvoice'

    attrs?: Attrs = [
        "type",
        "label",
        ["select-options", []],
        ['checked', false],
        ["default-value", ""],
        "component-id",
        "repeater",
        ["description", false],
        ["helptext", false],
        "entry-id",
        ["nested", false]
    ];

    reactive?: Reactive = [["entries", []]]
    static observedAttributes = ['checked', 'default-value']
    get splitLabel() {
        return this.label.replace(/([a-z])([A-Z])/g, '$1 $2')
    }

    protected session = new IndexedDBWrapper<DB.Session>(this.DB_NAME, 'session', this.DB_VERSION)

    html = () => {
        // LABEL COMPONENT
        const label = /*html*/`
            <label for="${this.label}-input" class="text-base font-semibold text-gray-700 capitalize font-space-mono mb-1 ${this.repeater && this.repeater == 'label' ? 'pl-4' : ''}">${this.splitLabel}</label>
        `;
        // WRAPPER COMPONENT
        const wrapper = (template: string, hideLabel: boolean = false) => /*html*/`
            <div
                class="flex flex-col space-y-1 ${typeof this.type !== 'object' ? 'py-2 px-4' : ''} ${this.repeater && typeof this.type !== 'object' ? 'px-8!' : ''}">
                ${!hideLabel ?
                    /*html*/`
                        ${label}
                        ${this.description ? `<p class="text-base mt--1.2! mb-2! leading-tight text-gray-600 font-sans">${this.description}</p>` : ''}
                        <div class="relative">
                            ${template}
                        </div>
                    ` : `${template}`
            }
                <!-- HELP TEXT -->
                ${this.helptext ? `<p class="text-sm text-gray-500 font-sans">${this.helptext}</p>` : ''}
            </div>
            ${this.getAttribute('save-btn') == 'hide'
                ? '' :
                // @ts-ignore
                this.type?.type === 'object' || this.repeater ?
                /*html*/`
                    <!-- SAVE BUTTON -->
                    <div class="grid sticky bottom-0 z-1">
                        <button id="save-entries" class="px-4 py-1 font-urbanist bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors ${this.repeater ? 'w-fit' : 'w-full'} rounded-none capitalize">
                            ${this.repeater ? `Add new <b class="uppercase">[${this.label}]</b> entry` : 'Save ' + this.label}
                        </button>
                    </div>
                `
                    : ''
            }
        `;
        // FALLBACK INPUT
        const fallback = /*html*/`
            <input
                type="${this.type}"
                value="${this.defaultValue}"
                id="${this.label}-input"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 w-full"
            />
        `
        // IMAGE INPUT
        const image = /*html*/`
            <input
                type="file"
                accept="image/*"
                id="${this.label}-image"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 w-full"
            />
            
            <img src="${this.defaultValue}" class="w-full h-32 object-cover rounded-none" />
        `
        // SELECT INPUT
        const select = /*html*/`
            <select
                name="${this.label}"
                id="${this.label}-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
            >
                <option value="" disabled selected>Select ${this.label}</option>
                ${this.selectOptions.map(opt => /*html*/`
                <option value="${opt}" class="uppercase" ${opt === this.defaultValue ? 'selected' : ''}>${opt}</option>
                `).join('')}
            </select>
            <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl -z-1"></span>
        `
        // CHECKBOX INPUT
        const svgIcon = /*html*/`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
        `
        const checkbox = /*html*/`
            <div class="inline-flex items-center space-x-2">
                <label class="relative flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    id="check"
                    ${this.checked ? 'checked' : ''}
                    class="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-slate-800 checked:border-slate-800 transition-all shadow-sm hover:shadow focus:ring focus:ring-slate-500"
                    />
                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        ${svgIcon}
                    </span>
                </label>
                <label for="check" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel}</label>
            </div>
        `
        // TEXTAREA INPUT
        const textarea = /*html*/`
            <textarea
                name="${this.label}"
                id="${this.label}-textarea"
                rows="5"
                class="px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 resize-y font-urbanist w-full"
            >${this.defaultValue}</textarea>
        `

        var localType: any = this.type;
        // ${ localType?.itemType?.type ? '' : i === 0 ? 'repeater' : ''}
        const array = /*html*/`
            <div class="flex items-center justify-between py-1 px-4 bg-white ${this.nested ? 'shadow-reflect shadow-gray-500 top-42px! z-2' : 'z-3'} ${this.repeater ? 'ml-5' : ''} border-y border-gray-200 shadow sticky top-0">
                <label for="${this.label}-array" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel} Repeater</label>
                <button id="add-entry" class="bg-gray-100 py-2 px-2 flex rounded hover:bg-gray-200">
                    <span class="i-solar-pen-new-square-outline"></span>
                </button>
            </div>

            <div class="grid relative ${this.nested ? 'bg-gray-100-' : ''} ${this.repeater ? 'ml-4' : ''}">
                ${Array.from(this.entries)?.map((entry, i) => /*html*/`
                    <editor-input
                        label="${this.label}"
                        type='${JSON.stringify(localType?.itemType || this.type)}'
                        component-id="${this.componentId}"
                        repeater="${i === 0 ? 'label' : ''}"
                        default-value='${!localType?.itemType?.type ? entry.value : JSON.stringify(entry)}'
                        ${entry.id ? `entry-id="${entry.id}"` : ''}
                        data-entry-index="${i}"
                        ${this.getAttribute('save-btn') ? `save-btn="${this.getAttribute('save-btn')}"` : ''}
                    ></editor-input>
                    
                    <div class="relative">
                        <button
                            id="remove-entries"
                            ${entry.id ? `data-entry-id="${entry.id}"` : ''} data-entry-index="${i}"
                            class="px-4 py-1 font-urbanist bg-stone-600 text-white text-sm hover:bg-stone-700 transition-colors w-fit rounded-none relative z-1 ${this.repeater ? 'left-8' : ''}">
                            Remove
                        </button>
                        <div class="w-4 border border-gray-500 absolute top-1/2 left-4 ${this.repeater ? '' : 'hidden'}"></div>
                    </div>
                    
                `).join('')}

                ${
                    Array.from(this.entries).length > 0 ? /*html*/`
                        <div class="h-[calc(100%_-_2rem)] w-4 absolute left-4 top-5" border="2 r-0 gray-500"></div>
                    ` : ''
                }
            </div>
        `

        const stringify = (payload: any) => {
            if (typeof payload === 'object' || Array.isArray(payload)) {
                return JSON.stringify(payload)
            }

            return payload
        }

        const object = /*html*/`
            <div class="flex flex-col ${this.repeater ? 'bg-gray-50' : 'pt-2 px-4'}">
                ${!this.repeater ? /*html*/`
                        <label for="${this.label}-object" class="text-base font-semibold text-gray-700 capitalize font-space-mono">${this.splitLabel}</label>
                ` : ''
            }
            </div>
            
            <div class="grid">
                ${localType?.shape?.map((opt: ObjectField, i: number) => /*html*/`
                    <editor-input
                        label="${opt.name}"
                        type='${JSON.stringify(opt.type)}'
                        select-options='${JSON.stringify(opt.options) || []}'
                        ${
                            opt.type === 'boolean' &&
                            this.defaultValue[opt.name] === true ? 'checked="true"' : ''
                        }
                        default-value='${stringify(this.defaultValue[opt.name] || opt.defaultValue)}'
                        save-btn="hide"
                        ${localType?.type ? `nested="true"` : ''}
                        ${this.repeater && this.repeater === 'label' ? `repeater="${i === 0 ? 'label' : ''}"` : this.repeater ? 'repeater' : ''}
                    ></editor-input>
                `).join('')}
            </div>
        `

        switch (localType.type) {
            case "array":
                return array;
            case "object":
                return wrapper(object, true);
        }

        switch (this.type) {
            case "boolean":
                return wrapper(checkbox, true);
            case "select":
                return wrapper(select);
            case "rich-text":
                return wrapper(textarea);
            case "image":
                return wrapper(image);
            default:
                return wrapper(fallback);
        }
    }

    css = () => /*css*/`
        @unocss-placeholder;
    `

    parseType = (typeAttr: string): PropertyType | string => {
        try {
            return JSON.parse(typeAttr);
        } catch {
            return typeAttr; // fallback for primitives like 'text', 'number', etc.
        }
    };

    validateType = (val: string) => {
        if(val === 'true') {
            return true;
        }

        if(val === 'false') {
            return false;
        }

        return val
    }

    parseEditorInput = (el: HTMLElement, labelOverride?: string): any => {
        // const label = labelOverride || el.getAttribute('label')!.toLowerCase();
        const label = labelOverride || el.getAttribute('label')!;
        const typeAttr = el.getAttribute('type');
        if (!typeAttr) return { [label]: this.validateType(el.getAttribute('default-value') || '') };

        const type = this.parseType(typeAttr);

        // ✅ Primitive type
        if (typeof type === 'string') {
            return { [label]: this.validateType(el.getAttribute('default-value') || '') };
        }

        // ✅ Object type
        if (type.type === 'object') {
            const obj: Record<string, any> = {};
            for (const field of type.shape) {
                const input = el.shadowRoot?.querySelector<HTMLElement>(`editor-input[label="${field.name}"]`);
                if (input) {
                    const parsed = this.parseEditorInput(input, field.name.toLowerCase());
                    Object.assign(obj, parsed);
                }
            }
            return { [label]: obj };
        }

        // ✅ Array type
        if (type.type === 'array') {
            const nestedInputs = el.shadowRoot?.querySelectorAll<HTMLElement>('editor-input');

            const values: any[] = [];

            nestedInputs?.forEach(input => {
                const parsed = this.parseEditorInput(input);
                console.log(parsed, Object.values(parsed))
                values.push(Object.values(parsed)[0]); // Get value without duplicating label
            });

            return { [label]: values };
        }

        return { [label]: this.validateType(el.getAttribute('default-value') || '') };
    };

    async onReady() {
        this.title = this.label

        if (typeof this.type === 'object') {

            if (this.getAttribute('status') === 'ready')
                return;

            if (this.type.type === 'array' && this.componentId) {
                await this.session.open();
                const response = await this.session.get(this.componentId!);
                this.entries = response?.properties[this.label] || [];

                Minze.listen(
                    `editor-input:${this.componentId}-${this.label}:rerender`,
                    async () => {
                        // console.log('rerendering....', entry)
                        const entry = await this.session.get(this.componentId!)
                        this.entries = entry?.properties[this.label] || [];

                        this.rerender()
                    }
                );

                this.setAttribute('status', 'ready');

                this.rerender();
            }

            else if (this.type.type === 'array') {
                this.entries = Array.from(this.defaultValue || []);
                this.setAttribute('status', 'ready');

                this.rerender()
            }
        };

    }

    eventListeners?: EventListeners = [
        [
            "input:not([type=file]), textarea, select",
            "input",
            (e: InputEvent) => {
                const input = e.target as HTMLInputElement;
                const value = this.type == 'boolean' ? input?.checked : input?.value || '';

                if (this.componentId && !this.repeater) {
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: value
                        }
                    });
                }

                this.setAttribute('default-value', value.toString());
            }
        ],
        [
            "input[type=file]",
            "input",
            (e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0];

                if (!file) return;

                new Compressor(file, {
                    quality: 0.6,

                    // The compression process is asynchronous,
                    // which means you have to access the `result` in the `success` hook function.
                    success: (result) => {
                        // CONVERT TO BASE64
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64data = reader.result;
                            if (this.componentId && !this.repeater) {
                                this.dispatch(`component:${this.componentId}:properties`, {
                                    data: {
                                        [this.label]: base64data
                                    }
                                });
                            }
                            // @ts-ignore
                            this.setAttribute('default-value', base64data);
                        }
                        reader.readAsDataURL(result);
                    },
                    error(err) {
                        console.log(err.message);
                    },
                });
            }
        ],

        [
            "#save-entries",
            "click",
            async () => {
                const entryElements = this.selectAll('editor-input') || [];
                const entries: Record<string, any> = {};

                if (this.entryId)
                    entries.id = this.entryId;

                entryElements.forEach((el: any) => {
                    const parsed = this.parseEditorInput(el);
                    Object.assign(entries, parsed);
                });

                if (typeof this.type !== 'object') {
                    entries.value = this.getAttribute('default-value')
                }

                console.log("🧠 Final structured data:", this.label, this.type, entries);
                if (this.componentId) {
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: entries
                        }
                    });
                }
            }
        ],

        [
            "#add-entry",
            "click",
            () => {
                const newItem = (() => {
                    if (typeof this.type === 'object') {
                        // ENTRY MUST ALWAYS BE AN ARRAY
                        if (this.type.type === 'array') {
                            const localType = this.type.itemType;
                            // IF ITEM TYPE IS OBJECT, RETURN DEFAULT VALUES
                            if (typeof localType === 'object') {
                                if (localType.type === 'object') {
                                    const c = localType.shape.reduce((acc: any, field) => {
                                        acc[field.name] = field.defaultValue;
                                        return acc;
                                    }, {});

                                    return {
                                        ...c,
                                        id: nanoid()
                                    }
                                }

                                if (localType.type === 'array') {
                                    return [];
                                }
                            }
                            // IF ITEM TYPE IS PRIMITIVE, RETURN DEFAULT VALUE
                            switch (localType) {
                                case 'text':
                                    return {
                                        id: nanoid(),
                                        value: 'randomness'
                                    };
                                case 'number':
                                    return {
                                        id: nanoid(),
                                        value: 0
                                    };
                                case 'boolean':
                                    return {
                                        id: nanoid(),
                                        value: false
                                    };
                                default:
                                    return {
                                        id: nanoid(),
                                        value: 'random'
                                    };
                            }
                        }
                    }

                    return {
                        id: nanoid(),
                        value: 'ness'
                    }; // Default for primitive types
                })()

                // console.log(newItem)

                const updated = this.entries.map((d, i) => {
                    const el = this.select(`[data-entry-index="${i}"]`) as HTMLElement;
                    const entryId = el.getAttribute('entry-id')
                    const parsed = this.parseEditorInput(el);

                    if (d.id) {
                        Object.assign(parsed[this.label], {
                            id: d.id
                        })
                    }

                    const type = this.parseType(el.getAttribute('type')!);
                    if (typeof type === 'object') {
                        return parsed[this.label]
                    }

                    return {
                        id: entryId,
                        value: parsed[this.label]
                    }
                })

                // console.log(updated)

                this.entries = [...updated, newItem];
                this.rerender();
            }
        ],
        // DELETE ENTRY
        [
            "#remove-entries",
            "click",
            (e) => {
                const button = e.target as HTMLButtonElement;
                const entryElement = button.closest('editor-input');
                const entryId = button.dataset.entryId;

                if (entryId && this.componentId) {
                    console.log(entryId)
                    // return
                    this.dispatch(`component:${this.componentId}:properties`, {
                        data: {
                            [this.label]: {
                                id: entryId,
                            }
                        },
                        action: 'delete'
                    });
                }

                else {
                    // Filter out the entry with the index
                    const entryIndex = Number(button.dataset.entryIndex);
                    this.entries = this.entries.filter((entry, i) => {
                        if (typeof entryId !== 'undefined' && entryId !== null) {
                            return entry.id !== entryId;
                        }
                        return i !== entryIndex;
                    });

                    this.rerender();
                }

            }
        ]
    ]

}