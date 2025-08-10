import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../atoms/properties.css?inline'
import { StyleEditorBase } from './base'

export class SpacingEditor extends StyleEditorBase {
    label = "Spacing - Margin & Padding"
    description = "Control outer and inner spacing for each side."
    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            {
                prop: 'margin-top',
                type: 'number',
                label: 'Margin Top',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'margin-left',
                type: 'number',
                label: 'Margin Left',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'margin-right',
                type: 'number',
                label: 'Margin Right',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'margin-bottom',
                type: 'number',
                label: 'Margin Bottom',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'padding-top',
                type: 'number',
                label: 'Margin Top',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'padding-left',
                type: 'number',
                label: 'Margin Left',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'padding-right',
                type: 'number',
                label: 'Margin Right',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'padding-bottom',
                type: 'number',
                label: 'Margin Bottom',
                value: '',
                description: '',
                key: nanoid(6),
                class: ''
            },
        ])]
    ]

    field = (opt: FieldConfig, i: number) => {
        const classes: Record<any, string> = {
            '0': 'top-2 left-1/2 -translate-x-1/2',
            '1': 'left-0 top-1/2 -translate-y-1/2',
            '2': 'right-0 top-1/2 -translate-y-1/2',
            '3': 'left-1/2 bottom-2 -translate-x-1/2',
        }

        return /*html*/`
            <input
                type="number"
                prop="${opt.prop}"
                placeholder="0"
                class="z-1 absolute ${classes[`${i}`]} w-12 text-center text-xs border rounded-lg px-1 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none border border-dashed border-gray-400"
            />
        `
    }

    // HTML TEMPLATE
    html = () => {
        return /*html*/`
            <details class="group py-0">
                <summary class="py-2">Spacing - Margin & Padding</summary>
                <div class="content">
                    <!-- <p>${this.description}</p> -->
                    <div class="relative w-full h-32 bg-gray-100/0 b-t-1">
                        ${this.fields.filter(d => d.prop.startsWith('margin')).map((prop, i) => this.field(prop, i)).join('')}
                        <div class="absolute inset-6 flex items-center justify-center border-3 border-indigo-700 rounded--xl"></div>
                    </div>
                </div>
                
                <details class="group p-0">
                    <summary class="py-2 group-open:b-b-1">Padding</summary>
                    <div class="content">
                        <!-- <p>${this.description}</p> -->
                        <div class="relative w-full h-32 bg-gray-100/0">
                            ${this.fields.filter(d => d.prop.startsWith('padding')).map((prop, i) => this.field(prop, i)).join('')}
                            <div class="absolute inset-6 flex items-center justify-center border-3 border-indigo-700 rounded--xl"></div>
                        </div>
                    </div>
                </details>
            </details>

        `
    }

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

        /* Hide spinners in Firefox */
        input[type=number] {
            -moz-appearance: textfield;
        }
    `

    // EVENT LISTENERS
    eventListeners: EventListeners = [
        ['input, select', 'input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const name = target.getAttribute('prop')!

            const value = target.value;
            const finalValue = value+'px';

            this.updateProperties(name, finalValue)
            
            // GET COMPONENT
            this.dispatch(`component:${this.componentId}:styles`, {
                [this.subElement]: {
                    [name]: finalValue
                }
            })
        }]
    ]
}
