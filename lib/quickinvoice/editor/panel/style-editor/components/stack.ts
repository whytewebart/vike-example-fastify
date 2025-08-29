import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../styles/properties.css?inline'
import { StyleEditorBase } from './base'

export class StackEditor extends StyleEditorBase {
    label = "Stack"
    description = ""
    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            // GENERATE FLEX PROPERTIES
            {
                prop: 'display',
                type: 'radio',
                label: 'Display',
                value: 'block',
                description: 'Set the display type of the stack.',
                class: '',
                options: ['block', 'flex', 'grid']
            },
            {
                prop: 'flex-direction',
                type: 'select',
                label: 'Direction',
                value: 'row',
                description: 'Set the direction of the stack.',
                group: "grid",
                class: '',
                options: ['row', 'column']
            },
            {
                prop: 'flex-wrap',
                type: 'select',
                label: 'Wrap',
                value: 'nowrap',
                description: 'Set the wrapping behavior of the stack.',
                group: "grid",
                class: '',
                options: ['nowrap', 'wrap', 'wrap-reverse']
            },
            {
                prop: 'justify-content',
                type: 'select',
                label: 'Spacing',
                value: 'flex-start',
                description: 'Set how items are justified along the main axis.',
                group: "grid",
                class: '',
                options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
            },
            {
                prop: 'align-items',
                type: 'select',
                label: 'Align Items',
                value: 'stretch',
                description: 'Set how items are aligned along the cross axis.',
                group: "grid",
                class: '',
                options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline']
            },
            // GAP COLUMN & ROW
            {
                prop: 'gap',
                type: 'number',
                label: 'Gap',
                value: '',
                description: 'Set the gap between items in pixels.',
                group: "gap",
                class: 'grid-col-span-2'
            },
            {
                prop: 'row-gap',
                type: 'number',
                label: 'Row Gap',
                value: '',
                description: 'Set the gap between rows in pixels.',
                group: "gap",
                class: ''
            },
            {
                prop: 'column-gap',
                type: 'number',
                label: 'Column Gap',
                value: '',
                description: 'Set the gap between columns in pixels.',
                group: "gap",
                class: ''
            }
        ])],
        ['count', 0]
    ]

    get getRadius() {
        return this.fields.find(({ prop }) => prop === 'border-radius')?.value;
    }

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
                    <!-- TEXT ALIGNMENT USING RADIO BUTTONS -->
                    <p class="font-semibold text-gray-500 font-space-mono" flex="~ justify-between">Display <input type="button" value="Reset" class="text-indigo-6 cursor-pointer hover:underline underline-offset-4"> </p>
                    <p class="text-gray-400 font-sans">Set the display type of the stack</p>
                    <div class="mt-1 mb-2 divide-x bg-gray-100" grid="~ cols-3" border="1">
                        ${
                            this.fields.find(d => d.prop === 'display')?.options?.map((value: string) => {
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
                                            name="display"
                                            prop="display"
                                            value="${value}"
                                            class="sr-only peer"
                                        />
                                        <div class="absolute top-0 left-0 right-0 m-1 rounded-lg h-[stretch] peer-checked:bg-white"></div>
                                    </label>
                                `
                            }).join('')
                        }
                    </div>

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

                    <div
                        class="relative w-full mt-3"
                        grid="~ cols-2 gap-3"
                    >
                        ${this.fields.filter(d => d.group === 'gap').map((prop, i) => `
                        <div class="${prop.class || '*:bg-gray-100!'}">
                            <label for="${prop.prop}" class="font-medium bg-transparent!">${prop.label}</label>
                            ${this.field(prop, i)}
                        </div>    
                        `).join('')}
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

        /* Hide spinners in Chrome, Safari, Edge */
        /* input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type=range]::-webkit-slider-thumb {
            border-radius: 0;
            -webkit-appearance: none;
            appearance: none;
            background-color: #3b82f6;
            width: 1rem; /* 16px */
            height: 1rem; 
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
            'gap',
            'row-gap',
            'column-gap',
        ]

        const value = target.value;
        const finalValue = (() => {
            if (omit.includes(name)) return value + 'px';
            
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
        ['input:not([type=button]), select', 'input', this.handleChange],
        ['input[type=button]', 'click', (e: MouseEvent) => {
            this.updateProperties('display', 'revert')
            // DISPATCH RESET EVENT
            this.dispatch(`component:${this.componentId}:styles`, {
                [this.subElement]: {
                    'display': 'revert',
                }
            });
        }]
    ]
}
