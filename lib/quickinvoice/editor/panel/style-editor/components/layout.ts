import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'
import { StyleEditorBase } from "./base"

import { nanoid } from 'nanoid'
import css from '../atoms/properties.css?inline'

export class LayoutEditor extends StyleEditorBase {
    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            {
                prop: 'border-top-width',
                type: 'number',
                label: 'Border Top',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'border-left-width',
                type: 'number',
                label: 'Border Left',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'border-right-width',
                type: 'number',
                label: 'Border Right',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'border-bottom-width',
                type: 'number',
                label: 'Border Bottom',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'border-radius',
                type: 'range',
                label: 'Border Radius',
                value: '0',
                description: 'Set the border radius of the component.',
                key: nanoid(6),
                class: ''
            }
        ])],
    ]
    
    get getRadius() {
        return this.fields.find(({ prop }) => prop === 'border-radius')?.value || '0';
    }

    field = (opt: FieldConfig, i: number) => {

        return /*html*/`
            <input
                type="number"
                prop="${opt.prop}"
                placeholder="0"
                class="text-center text-sm font-urbanist px-1 py-2"
                focus="outline-none ring-2 ring-blue-400 shadow z-1"
            />
        `
    }

    // HTML TEMPLATE
    html = () =>  /*html*/`
            <details class="group py-0">
                <summary class="py-2">Border</summary>
                <div class="pb-4">
                    <!-- <p>Set individual borders.</p> -->
                    <div grid="~ cols-4" class="font-space-mono font-bold text-center text-gray-400 text-sm pb-1.5">
                        <p>TOP</p>
                        <p>LEFT</p>
                        <p>RIGHT</p>
                        <p>BOTTOM</p>
                    </div>

                    <div
                        class="relative w-full bg-white divide-x-2 divide-gray-300"
                        grid="~ cols-4"
                        border="2 gray-300"
                    >
                        ${this.fields.filter(d => d.prop.endsWith('width')).map((prop, i) => this.field(prop, i)).join('')}
                    </div>

                    <div class="relative">
                        <select
                            prop="border-style"
                            id=""
                            class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full capitalize"
                        >
                            <option selected disabled>Select Border Style</option>
                            ${['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']
            .map(style => {
                var selected = this.selectProp['border-style'] === style;

                return `<option ${selected ? 'selected' : ''} value="${style}">${style}</option>`
            }).join('')
        }
                        </select>

                        <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl z-1"></span>
                    </div>

                    <div grid="~ cols-[auto_1fr] gap-x-4" class="mt-3">
                        <p class="font-space-mono font-semibold text-gray-500">Border Color</p>

                        <input
                            type="color"
                            prop="border-color"
                            value="${this.selectProp['border-color'] || '#000000'}"
                            class="text-center text-sm font-urbanist h-5 py-2 px-1 bg-white w-full"
                            focus="outline-none ring-2 ring-blue-400 shadow z-1"
                        />
                    </div>

                    <div grid="~ gap-y-4" class="mt-3">
                        <p class="font-space-mono font-semibold text-gray-500 text-right">Border Radius [${this.getRadius}]</p>

                        <input
                            type="range"
                            prop="border-radius"
                            class="text-center text-sm font-urbanist h-.1rem bg-gray-600 w-full rounded-none appearance-none"
                            focus="outline-none ring-offset-4 ring-2 ring-blue-400 shadow z-1"
                            min="0"
                            max="100"
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

        /* Hide spinners in Chrome, Safari, Edge */
        input[type=number]::-webkit-inner-spin-button,
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
        }
    `

    handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('prop')!

        const omit = ['border-color', 'border-style']

        const value = target.value;
        const finalValue = !omit.includes(name) ? value + 'px' : value;

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
