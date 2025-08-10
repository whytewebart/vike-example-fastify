import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../atoms/properties.css?inline'
import { StyleEditorBase } from './base'

export class TypographyEditor extends StyleEditorBase {
    label = "Typography"
    description = "Set individual typography styles."

    static observedAttributes = ['component-id', 'sub-element']

    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            {
                prop: 'font-family',
                type: 'select',
                label: 'Font Family',
                value: '',
                description: 'Select a font family.',
                group: "grid",
                class: '',
                options: [
                    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
                ]
            },
            {
                prop: 'font-size',
                type: 'number',
                label: 'Font Size',
                value: '',
                description: 'Set the font size in pixels.',
                group: "grid",
                class: ''
            },
            {
                prop: 'font-weight',
                type: 'select',
                label: 'Font Weight',
                value: '',
                description: 'Select a font weight.',
                group: "grid",
                class: '',
                options: [
                    'normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'
                ]
            },
            {
                prop: 'font-style',
                type: 'select',
                label: 'Font Style',
                value: '',
                description: 'Select a font style.',
                group: "grid",
                class: '',
                options: [
                    'normal', 'italic', 'oblique'
                ]
            },
            {
                prop: 'text-decoration',
                type: 'select',
                label: 'Text Decoration',
                value: '',
                description: 'Select a text decoration style.',
                group: "grid",
                class: '',
                options: [
                    'none', 'underline', 'overline', 'line-through', 'blink'
                ]
            },
            {
                prop: 'text-transform',
                type: 'select',
                label: 'Text Transform',
                value: '',
                description: 'Select a text transformation style.',
                group: "grid",
                class: '',
                options: [
                    'none', 'capitalize', 'uppercase', 'lowercase'
                ]
            },
            {
                prop: 'line-height',
                type: 'number',
                label: 'Line Height',
                value: '',
                description: 'Set the line height in pixels.',
                group: "grid",
                class: ''
            },
            {
                prop: 'letter-spacing',
                type: 'number',
                label: 'Letter Spacing',
                value: '',
                description: 'Set the letter spacing in pixels.',
                group: "grid",
                class: ''
            },
            {
                prop: 'text-align',
                type: 'select',
                label: 'Text Align',
                value: '',
                description: 'Select a text alignment.',
                group: "",
                class: '',
                options: [
                    'left', 'center', 'right', 'justify'
                ]
            },
            {
                prop: 'color',
                type: 'color',
                label: 'Text Color',
                value: '',
                description: 'Set the text color.',
                group: "",
                class: ''
            }
        ])],
        ['count', 0]
    ]

    field = (opt: FieldConfig, i: number) => {
        if (opt.type === 'select') {
            const options = /*html*/`
                ${opt.options?.map((value: string) => `<option ${value === opt.value ? 'selected' : ''} value="${value}" class="">${value}</option>`).join('')
                }
            `
            return /*html*/`
                <div class="relative bg-white">
                    <select
                        id="${opt.prop}"
                        prop="${opt.prop}"
                        data-group="${opt.group}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
                    >
                        ${options}
                    </select>
                    <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl"></span>
                </div>
            `
        }

        return /*html*/`
            <input
                type="${opt.type}"
                prop="${opt.prop}"
                id="${opt.prop}"
                data-group="${opt.group}"
                placeholder="0"
                class="bg-white text-sm font-urbanist px-3 py-2 w-full"
                focus="outline-none ring-2 ring-blue-400 shadow z-1"
                border="1 gray-300"
            />
        `
    }

    // HTML TEMPLATE
    html = () =>  /*html*/`
            <details open class="group py-0">
                <summary class="py-2">${this.label}</summary>
                <div class="pb-4">
                    <div
                        class="relative w-full"
                        grid="~ cols-2 gap-3"
                    >
                        ${this.fields.filter(d => d.group === 'grid').map((prop, i) => `
                        <div class="${prop.class || ''}">
                            <label for="${prop.prop}" class="font-medium">${prop.label}</label>
                            ${this.field(prop, i)}
                        </div>    
                        `).join('')}
                    </div>

                    <!-- TEXT ALIGNMENT USING RADIO BUTTONS -->
                    <p class="font-semibold text-gray-500 mt-4">Text Alignment</p>
                    <div class="mt-2 divide-x bg-gray-100" grid="~ cols-4" border="1">
                        ${
                            this.fields.find(d => d.prop === 'text-align')?.options?.map((value: string) => {
                                return /*html*/`
                                    <label
                                        for="${value}"
                                        class="block font-medium w-full h-full py-1.5 peer-checked:bg-white text-center relative cursor-pointer"
                                        hover="bg-gray-200"
                                    >
                                        <span class="z-1 relative">${value}</span>
                                        <input
                                            type="radio"
                                            id="${value}"
                                            name="text-align"
                                            prop="text-align"
                                            value="${value}"
                                            class="sr-only peer"
                                        />
                                        <div class="absolute top-0 left-0 right-0 m-1 rounded-lg h-[stretch] peer-checked:bg-white"></div>
                                    </label>
                                `
                            }).join('')
                        }
                    </div>

                    <div grid="~ gap-y-4" class="mt-3">
                        <p class="font-space-mono font-semibold text-gray-500">Text Color</p>

                        <input
                            type="color"
                            prop="color"
                            value="${this.selectProp['color'] || '#000000'}"
                            class="text-center text-sm font-urbanist h-5 py-2 px-1 bg-white w-full"
                            focus="outline-none ring-2 ring-blue-400 shadow z-1"
                        />
                    </div>
                </div>
                
            </details>

        `

    // STYLES
    css = () => /*css*/`
        @unocss-placeholder;
        ${css}

        :host {
            padding-bottom: 5em;
        }

        input[type=range]::-moz-range-thumb {
            background-color: #3b82f6;
            width: 1rem; /* 16px */
            height: 1rem; /* 16px */
            border-radius: 0; /* square thumb */
            border: none;
        }

        /* Hide spinners in Firefox */
        input[type=number] {
            -moz-appearance: textfield;
        } */
    `

    handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('prop')!

        const omit = [
            'font-size',
            'letter-spacing',
            'line-height'
        ]

        const value = target.value;
        const finalValue = (() => {
            if (target.dataset.group === 'grid') {
                if (omit.includes(name)) return value + 'px';
                return value;
            }

            return value
        })()

        this.updateProperties(name, finalValue)

        // GET COMPONENT
        this.dispatch(`component:${this.componentId}:styles`, {
            [this.subElement]: {
                [name]: finalValue
            }
        })
    }

    // EVENT LISTENERS
    eventListeners: EventListeners = [
        ['input, select', 'input', this.handleChange]
    ]
}
