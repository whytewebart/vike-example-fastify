import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../styles/properties.css?inline'
import properties from "../../properties.json"
import { StyleEditorBase } from './base'

export class DimensionEditor extends StyleEditorBase {

    label = "Dimension"
    description = "Edit the [Width & Height] of the component"

    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            {
                prop: 'width',
                type: 'number',
                label: 'Width',
                value: '',
                description: 'Set the width of the component.',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'height',
                type: 'number',
                label: 'Height',
                value: '',
                description: 'Set the height of the component.',
                key: nanoid(6),
                class: ''
            },
            {
                prop: 'flex',
                type: 'select',
                label: 'Flex',
                value: 'none',
            },
        ])]
    ]

    field = (opt: FieldConfig) => {
        const regex = /\d+(?:\.\d+)?\s*(px|%)/;
        const unitOptions = /*html*/`
            ${['px', '%']
                .map((value: string) => `<option ${opt.value.match(regex)?.includes(value) ? 'selected' : ''} value="${value}" class="">${value}</option>`).join('')
            }
        `

        return /*html*/`
            <div class="grid cols-[1fr_auto]" border="1 gray-300">
                <input
                    label="${opt.label}"
                    placeholder="${opt.value}"
                    prop="${opt.prop}"
                    type="${opt.type}"
                    id="${opt.prop}"
                    min="0"
                />
                <select
                    data-prop-type="unit"
                    data-prop-name="${opt.prop}"
                    class="bg-white w-full px-3 py-2 border-gray-300 rounded-none text-sm text-gray-800 font-urbanist appearance-none w-full"
                >
                    ${unitOptions}
                </select>
            </div>
        `
    }

    // HTML TEMPLATE
    html = () => {
        return /*html*/`
            <details open>
                <summary>${this.label}</summary>
                <div class="content pb-2">
                    <p>${this.description}</p>
                    <div class="form">
                        ${this.fields.filter(d => d.prop !== 'flex').map(prop => `
                        <div class="${prop.class || ''}">
                            <label for="${prop.prop}">${prop.label}</label>
                            ${this.field(prop)}
                        </div>
                        `).join('')}
                    </div>
                    
                    <div class="grid-col-span-2 space-y-3 mt-3">
                        <label for="flex" class="font-space-mono font-700">Flex Container</label>
                        <div
                            class="mt-2 bg-gray-100"
                            grid="~ cols-2"
                            border="1"
                        >
                            <label
                                for="1"
                                class="flex justify-center items-center font-medium w-full h-full py-1.5 peer-checked:bg-white text-center relative cursor-pointer"
                                hover="bg-gray-200"
                            >
                                <span class="z-1 relative">flex</span>
                                <input
                                    type="radio"
                                    id="1"
                                    name="flex"
                                    prop="flex"
                                    value="1"
                                    class="sr-only peer"
                                />
                                <div class="absolute top-0 left-0 right-0 m-1 rounded-lg h-[stretch] peer-checked:bg-white"></div>
                            </label>

                            <label
                                for="none"
                                class="flex justify-center items-center font-medium w-full h-full py-1.5 peer-checked:bg-white text-center relative cursor-pointer"
                                hover="bg-gray-200"
                            >
                                <span class="z-1 relative">Revert</span>
                                <input
                                    type="radio"
                                    id="none"
                                    name="flex"
                                    prop="flex"
                                    value="none"
                                    class="sr-only peer"
                                />
                                <div class="absolute top-0 left-0 right-0 m-1 rounded-lg h-[stretch] peer-checked:bg-white"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </details>
        `
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
            width: 100%;
        }

        .form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: .75rem;
            margin-top: .5rem;
        }

        :host {
            padding-bottom: 5em;
        }
    `

    handleChange = (e: Event) => {
        const _ = e.target as HTMLElement
        const target = _.parentElement as HTMLDivElement;

        const input = target.querySelector('input') as HTMLInputElement;
        const select = target.querySelector('select') as HTMLSelectElement;
        const name = input.getAttribute('prop')!

        const value = input.value;
        const unit = select.value;
        const finalValue = value + unit

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
        ['input:not([type="radio"]), select', 'input', this.handleChange],
        ['input[type="radio"]', 'input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const name = target.getAttribute('prop')!
            const value = target.value;

            this.updateProperties(name, value)

            // GET COMPONENT
            this.dispatch(`component:${this.componentId}:styles`, {
                [this.subElement]: {
                    [name]: value,
                    'display': name === 'flex' && value === '1' ? 'flex' : 'initial'
                }
            })
        }],
    ]
}
