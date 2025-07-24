import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../atoms/properties.css?inline'
import properties from "../../properties.json"

export interface FieldConfig {
    prop: string
    type: 'text' | 'number' | 'color' | 'select' | 'unit'
    label: string
    default: string
    description?: string
    class?: string
    options?: string[]
    key?: string

    requiresUnit?: boolean
    unit?: string
    customUnitField?: boolean // identifies a special unit-control field
}


export interface DimensionEditor {
    properties: {
        label: string;
        description: string;
        fields: FieldConfig[]
    }[];

    componentId: string;
    subElement: string;
    elements?: Record<string, {
        styles?: Record<string, string>;
        properties?: Record<string, any>;
    }>,
    styles?: Record<string, string>
}

export class DimensionEditor extends MinzeElement {
    // ATTRIBUTES
    attrs: Attrs = [
        "component-id",
        ["sub-element", "host"],
        ["elements", {}],
        ["styles", {}]
    ]

    label = "Dimension"
    description = "Edit the dimensions of the component"

    static observedAttributes = ['component-id', 'sub-element']

    // REACTIVE STATE
    // reactive: Reactive = [
    //     ['properties', [
    //         {
    //             prop: 'width',
    //             type: 'number',
    //             label: 'Width',
    //             default: '',
    //             description: 'Set the width of the component.',
    //             key: nanoid(6),
    //             class: ''
    //         },
    //         {
    //             prop: 'height',
    //             type: 'number',
    //             label: 'Height',
    //             default: '',
    //             description: 'Set the height of the component.',
    //             key: nanoid(6),
    //             class: ''
    //         },
    //         {
    //             prop: 'unit',
    //             type: 'select',
    //             label: 'Unit',
    //             default: 'px',
    //             description: 'Set the unit of the height & width.',
    //             key: nanoid(6),
    //             class: 'col-span-2',
    //             options: ['px', '%']
    //         }
    //     ]]
    // ]

    reactive: Reactive = [
        [
            'properties',
            properties.map(d => ({ ...d, key: nanoid(6) }))
        ]
    ]

    field = (
        type: string = "input",
        opt: typeof this.properties[0]['fields'][0]
    ) => {
        if (type === 'select') {
            const options = /*html*/`
                ${opt.options?.map((value: string) => `<option ${value === opt.default ? 'selected' : ''} value="${value}" class="">${value}</option>`).join('')
                }
            `
            return /*html*/`
                <div class="relative bg-white">
                    <select
                        id="${opt.prop}"
                        prop="${opt.prop}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
                    >
                        ${options}
                    </select>
                    <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl"></span>
                </div>
            `
        }

        const validateValue = (value: string) => {
            if (opt.type === 'number') {
                // REMOVE ANY TEXT
                return parseFloat(value.replace(/[^\d.]/g, ''))
            }

            return value
        }

        const regex = /\d+(?:\.\d+)?\s*(px|%)/;

        const unitOptions = /*html*/`
            ${['px', '%']
                .map((value: string) => `<option ${opt.default.match(regex)?.includes(value) ? 'selected' : ''} value="${value}" class="">${value}</option>`).join('')
            }
        `

        return /*html*/`
            <div class="grid ${opt.requiresUnit ? 'cols-[1fr_auto]' : ''}">
                <input
                    label="${opt.label}"
                    placeholder="${opt.default}"
                    prop="${opt.prop}"
                    type="${opt.type}"
                    id="${opt.prop}"
                    value="${validateValue(opt.default)}"
                    min="0"
                />

                ${opt.requiresUnit ? /*html*/`
                        <!-- UNIT SELECT FIELD -->
                        <div class="relative bg-white">
                            <select
                                data-prop-type="unit"
                                data-prop-name="${opt.prop}"
                                class="w-full px-3 py-2 border b-l-0 border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
                            >
                                ${unitOptions}
                            </select>
                        </div>
                        <!-- UNIT SELECT FIELD -->
                    ` : ''
            }

            </div>
        `
    }

    // HTML TEMPLATE
    html = () => {
        return this.properties.map(({ fields, label, description }) => {
            return /*html*/`
                <details open>
                    <summary>${label}</summary>
                    <div class="content">
                    <p>${description}</p>
                    <div class="form">
                        ${fields.map(prop => `
                        <div class="${prop.class || ''}">
                            <label for="${prop.prop}">${prop.label}</label>
                            ${this.field(prop.type, prop)}
                        </div>
                        `).join('')}
                    </div>
                    </div>
                </details>
            `
        }).join('')
    }

    // STYLES
    css = () => /*css*/`
        @unocss-placeholder;
        ${css}

        .form div {
            display: grid;
            width: 100%;
        }

        .form div label {
            font-family: 'Space Mono';
            font-weight: 700;
            font-size: 14px;
            margin-bottom: .5rem;
        }

        .form div input {
            background-color: #ffffff;
            padding: .3em .5em;
            border-radius: 0;
            border: 1px solid #b6b6b6ff;
            width: 100%;
        }

        .form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: .75rem;
            margin-top: .5rem;
        }
    `

    onReady() {
    }

    afterAttributeChange(name?: string, oldValue?: string | null, newValue?: string | null) {

        this.properties = this.properties.map(({ fields, ...rest }) => {
            const __fields = fields.map(d => {
                var value = '';
                if (this.elements) {
                    const r = this.elements[this.subElement]
                    const s = this.styles;

                    if (this.subElement === 'host' && s) {
                        s[d.prop] ? value = s[d.prop] : value = ''
                    }

                    else if (r) {
                        r.styles && r.styles[d.prop] ? value = r.styles[d.prop] : value = ''
                    }
                }

                return {
                    ...d,
                    default: value
                }
            })

            return {
                ...rest,
                fields: __fields
            }
        })

        this.rerender()
    }

    // EVENT LISTENERS
    eventListeners: EventListeners = [
        ['input, select', 'input', (e: Event) => {
            const target = e.target as HTMLInputElement
            const name = target.getAttribute('prop')!
            const value = target.value;
            const propType = target.dataset.propType;

            if (propType === 'unit') {
                const name = target.dataset.propName!;
                const container = target.closest(`.grid`)
                const associate = container?.querySelector('* > input') as HTMLInputElement

                // update properties
                this.properties = this.properties.map(d => {
                    const __fields = d.fields.map(f => {
                        if (f.prop === name) {
                            return {
                                ...f,
                                default: value
                            }
                        }

                        return f
                    })

                    return {
                        ...d,
                        fields: __fields
                    }
                })

                this.dispatch(`component:${this.componentId}:styles`, {
                    [this.subElement]: {
                        [name]: associate.value + target.value
                    }
                })

                return;
            }

            const field = this.properties
                .flatMap(group => group.fields)
                .find(f => f.prop === name);

            if (!field) return;
            let finalValue: string = value

            if (field.requiresUnit && !isNaN(Number(value))) {
                finalValue = `${value}${field.unit ?? 'px'}`
            }

            // GET COMPONENT
            this.dispatch(`component:${this.componentId}:styles`, {
                [this.subElement]: {
                    [name]: finalValue
                }
            })
        }]
    ]
}
