import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

import { nanoid } from 'nanoid'
import css from '../styles/properties.css?inline'
import { StyleEditorBase } from './base'
import Compressor from 'compressorjs'

export class BackgroundEditor extends StyleEditorBase {
    label = "Background"
    description = "Edit the background styles of the component."
    // REACTIVE STATE
    reactive: Reactive = [
        ['properties', JSON.stringify([
            // GENERATE BACKGROUND PROPERTIES
            {
                prop: 'background-color',
                type: 'color',
                label: 'Background Color',
                value: '',
                description: 'Set the background color of the component.',
                group: '',
                class: ''
            },
            {
                prop: 'background-image',
                type: 'file',
                label: 'Background Image',
                value: '',
                description: 'Set the background image of the component.',
                group: '',
                class: ''
            },
            {
                prop: 'background-size',
                type: 'select',
                label: 'Background Size',
                value: 'cover',
                options: ['cover', 'contain', 'auto'],
                description: 'Set the size of the background image.',
                group: 'grid',
                class: ''
            },
            {
                prop: 'background-position',
                type: 'select',
                label: 'Background Position',
                value: 'center center',
                options: ['center center', 'top left', 'top right', 'bottom left', 'bottom right'],
                description: 'Set the position of the background image.',
                group: 'grid',
                class: ''
            },
            {
                prop: 'background-repeat',
                type: 'select',
                label: 'Background Repeat',
                value: 'no-repeat',
                options: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
                description: 'Set the repeat behavior of the background image.',
                group: 'grid',
                class: ''
            },
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
                    <!-- RESET BUTTON -->
                     <div flex="~ justify-end" class="mb-4">
                         <input type="button" value="Reset" class="text-indigo-6 cursor-pointer hover:underline underline-offset-4 font-space-mono font-semibold" />
                     </div>

                    <div grid="~ cols-[auto_1fr] gap-x-3" class="pb-4">
                        <label for="background-color" class="font-medium">Background</label>
                        <input
                            type="color"
                            prop="background-color"
                            id="background-color"
                            data-group=""
                            class="bg-white text-sm font-urbanist w-full h-10 px-.5"
                            focus="outline-none ring-2 ring-blue-400 shadow z-1"
                            border="1 gray-300"
                        />
                    </div>

                    <div grid="~ gap-y-1" class="pb-2">
                        <label for="background-color" class="font-medium">Background Image</label>
                        <div class="divide-y divide-gray-300" border="1 gray-300">
                            <div class="preview w-full bg-gray-100 h-30" style="background-image:${this.fields.find(d => d.prop === 'background-image')?.value}; background-size:${this.fields.find(d => d.prop === 'background-size')?.value}; background-position:${this.fields.find(d => d.prop === 'background-position')?.value}; background-repeat:${this.fields.find(d => d.prop === 'background-repeat')?.value};"></div>
                            <input
                                type="file"
                                prop="background-image"
                                id="background-image"
                                accept="image/*"
                                data-group=""
                                class="bg-white text-sm font-urbanist w-full p-2"
                                focus="outline-none ring-2 ring-blue-400 shadow z-1"  
                            />
                        </div>
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

    handleChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const name = target.getAttribute('prop')!

        const value = target.value;
        const finalValue = await (async () => {
            if (target.type === 'file') {
                const file = target.files?.[0];
                if (!file) return '';
                // Check if the file is an image
                if (!file.type.startsWith('image/'))
                    return '';

                var base64data:FileReader['result'] = ''
                // If it's an image, compress it
                await new Promise((resolve, reject) => {
                    new Compressor(file, {
                        quality: 0.6,

                        success: (result) => {
                            // CONVERT TO BASE64
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                base64data = reader.result;
                                resolve(base64data);
                            }
                            reader.readAsDataURL(result);
                        },
                        error(err) {
                            console.log(err.message);
                            reject(err);
                        },
                    });
                })

                return `url(${base64data})`
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
        ['input:not([type=button]), select', 'input', this.handleChange],
        ['input[type=button]', 'click', (e: MouseEvent) => {
            this.fields.forEach(({ prop }) => {
                if (prop.startsWith('background-')) {
                    this.updateProperties(prop, '')
                }
            })

            // DISPATCH RESET EVENT
            this.dispatch(`component:${this.componentId}:styles`, {
                [this.subElement]: {
                    'background-color': '',
                    'background-image': '',
                    'background-size': 'cover',
                    'background-position': 'center center',
                    'background-repeat': 'no-repeat'
                }
            })
        }]
    ]
}
