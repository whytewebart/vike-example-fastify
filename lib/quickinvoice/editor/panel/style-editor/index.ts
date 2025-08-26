import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

// IMPORT ATOMS
import { EditorComponent } from '../../component';
import PropertyEditor from './atoms/properties';

export interface StyleEditor {
    component?: EditorComponent;
    subElements?: Pick<SubElement, 'key'|'name'>[];
    selectedElement?: string;
    componentToShow?: "styles" | "properties";
    allowedProperties?: string[];

    editLabel: boolean;
    componentLabel?: string;
}

export class StyleEditor extends MinzeElement {
    protected property = new PropertyEditor({
        layerInstance: this,
        componentId: this.component?.id!,
        componentType: this.component?.dataset.type!
    })

    reactive: Reactive = [
        'componentId',
        ['subElements', []],
        ["selectedElement", ''],
        ["componentToShow", "properties"],
        ['allowedProperties', []],
        ['editLabel', false],
        ['componentLabel', null]
    ]

    handleToggleClick = (event: Event) => {
        const target__ = event.target as HTMLDivElement;
        const target = target__.closest("[data-component]") as HTMLDivElement;
        const component = <"styles" | "properties">target.dataset.component;

        // console.log(event, target, component)

        this.componentToShow = component;
    }

    handleEditLabel = (event: Event) => {
        this.editLabel = !this.editLabel;
    }

    header = () => {
        const styles = {
            header: 'grid grid-cols-2 border-b border-t-2 divide-x divide-gray-200 bg-gray-50',
            column: 'py-2 px-4 *:font-space-mono text-base font-semibold text-gray-700 cursor-pointer hover:bg-gray-100',
        };

        return /*html*/`
            <div part="header" class="${styles.header}">
                <div class="${styles.column} ${this.component && this.componentToShow === 'styles' ? 'bg-gray-100' : ''}"  data-component="styles">
                    <h3>Styles</h3>
                </div>
                <div class="${styles.column} ${this.component && this.componentToShow === 'properties' ? 'bg-gray-100' : ''}" data-component="properties">
                    <h3>Properties</h3>
                </div>
            </div>
            <div class="p-2 px-4 bg-gray-50 border-b grid font-sans ${this.component ? '' : 'hidden'}">
                <div class="${this.editLabel ? 'mb-1' : ''}" flex="~ items-center">
                    <h3 class="font-space-mono font-semibold text-lg capitalize relative -left-1 ${this.editLabel ? 'hidden' : ''}">
                        [${ this.componentLabel || this.component?.type+' component'}] </h3>

                    <input
                        type="text"
                        class="bg-white py-1.5 px-3 b-1 rounded-lg mr-1 ${this.editLabel ? '': 'hidden'}"
                        id="label-edit-input"
                        placeholder="Component Label"
                        value="${this.componentLabel ?? ''}"
                    >

                    <button
                        class="flex p-2 bg-transparent rounded-lg"
                        hover="bg-gray-100"
                        focus="ring-1 ring-indigo-6 ring-offset-3"
                        title="Edit Label"
                        id="handle-edit-label"
                    >
                        <span class="${this.editLabel ? 'i-solar-check-read-outline' : 'i-solar-pen-bold-duotone'}"></span>
                    </button>

                    <button
                        class="flex p-2 bg-red-100 rounded-lg"
                        hover="bg-red-200"
                        focus="ring-1 ring-red-6 ring-offset-3"
                        title="Delete Component"
                        id="delete-component"
                    >
                        <span class="i-solar-trash-bin-trash-outline text-red"></span>
                    </button>
                </div>
                <p>Edit the properties of the component.</p>
            </div>
        `
    }

    // col-span-2

    // SELECT INPUT
    elementSelect = () => {
        const v1 = /*html*/`
            <div class="bg-gray-50 px-4 py-2">
                <h3 class="font-space-mono font-semibold text-lg capitalize relative -left-1 mb-1 ${!this.component ? 'hidden' : ''}">[${this.component?.dataset.name}] component </h3>
                <div class="relative bg-white">
                    <select
                        name="subElement"
                        id="subElement-select"
                        class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
                    >
                        <option
                            value=""
                            disabled
                        >Select Sub-Element</option>
                        
                        ${this.subElements?.map(opt => `<option value="${opt.key}" class="">${opt.name}</option>`).join('')}
                    </select>
                    <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl"></span>
                </div>
            </div>
        `;

        const v2 = /*html*/`
            <div class="${this.subElements && this.subElements.length > 0 ? '' : 'hidden'}">
                <details open class="group b-b-1 open:b-b-">
                    <summary
                        class="py-2 px-4 bg-white transition-all"
                        flex="~ items-center justify-between"
                        hover="cursor-pointer bg-gray-100"
                        group-open="b-b-1 sticky top-42px z-1"
                    >
                        <p class="font-space-mono font-semibold">
                            Select Nested Elements
                        </p>
                        <span class="i-solar-alt-arrow-down-bold text-xl mr-1 group-open:i-solar-alt-arrow-up-bold!"></span>
                    </summary>
                    
                    <ul class="divide-y bg-gray-50/20 b-b-">
                        ${this.subElements?.map(opt => `
                            <li sub-element-option data-value="${opt.key}" class="px-3 py-1 font-space-mono transition-all" hover="bg-gray-100 cursor-pointer tracking-.8 font-bold shadow z-1">${opt.name} ${this.selectedElement === opt.key ? '<b class="tracking-normal!">[Selected]</b>' : ''} </li>
                            `).join('')
                        }
                    </ul>
                    <p class="text-center font-space-mono font-bold py-2 bg-gray-50/20">
                        <!-- [•] -->
                    </p>
                </details>

            </div>
        `

        return v2
    }

    toggleComponentToRender = () => {
        if (this.component) {
            if (this.componentToShow === 'properties') {
                return this.property.html()
            }

            const renderElement = (tag: string) => {
                return /*html*/`
                    <${tag}
                        ${this.component?.id ? `component-id="${this.component.id}"` : ''}
                        ${this.component?.styles ? `styles='${JSON.stringify(this.component.styles)}'` : ''}
                        ${this.component?.subElements ? `elements='${JSON.stringify(this.component.subElements)}'` : ''}
                        ${this.selectedElement ? `sub-element="${this.selectedElement}"` : ''}
                    ></${tag}>
                `
            }

            const emptyTemplate = /*html*/`
                <div class="p-4 text-center">
                    <p class="text-gray-500 font-space-mono font-semibold">No styles available for this component.</p>
                </div>
            `

            const elements = this.allowedProperties ?? [];

            if (!this.subElements || this.subElements?.length == 0) {
                return /*html*/`
                    <div class="py-4 px-2 text-center bg-gray-50">
                        <div>
                            <p class="text-gray-500 font-urbanist text-lg trackinng-tight font-semibold pb-1">
                                Styling not available for this component
                            </p>

                            <div border="1 blue-6" class="mx-4"></div>
                        </div>
                    </div>
                `
            }

            return /*html*/`
                ${this.elementSelect()}
                ${elements.map(tag => renderElement(tag)).join('')}
                ${elements.length === 0 ? emptyTemplate : ''}
            `
        }

        return /*html*/`
            <div class="p-4 text-center bg-gray-50">
                <p class="text-gray-500 font-urbanist text-lg trackinng-tight font-semibold">
                    Select a component to begin editing
                </p>
            </div>
        `
    }

    html = (): string => /*html*/`
        ${this.header()}
        ${this.toggleComponentToRender()}
    `

    afterRender() {
    }

    eventListeners: EventListeners = [
        [
            window,
            'canvas:component:selected',
            async (e) => {
                this.component = e.detail.component
                const componentId = e.detail.component?.id;
                const componentType = this.component?.getAttribute('type');
                const componentProps = this.component?.getAttribute('_properties')
                this.componentLabel = this.component?.getAttribute('_label') || '';

                // SET COMPONENT ON PROPERTY CLASS
                this.property.setComponent({
                    id: componentId,
                    type: componentType!,
                    name: this.component?.dataset.name,
                });

                this.property.setProperties(JSON.parse(componentProps || '{}'))
                // SET STYLES
                await import('@/quickinvoice/definition')
                    .then(({ components, templates }) => {
                        return {
                            ...components,
                            ...templates
                        }
                    })
                    .then((response) => {
                        const definition = Object.values(response)
                            .find(def => def.type == componentType!);

                        if (definition) {
                            this.subElements = definition.subElements?.filter(d => !d.hidden).map(({ key, name }) => ({ key, name })) || [];
                            this.allowedProperties = definition.styleSettings?.allowedProperties || [];

                            if (definition.capabilities?.allowSubElementRoot) {
                                this.subElements = [
                                    {
                                        key: 'host',
                                        name: 'Root'
                                    },
                                    ...this.subElements
                                ]
                            }
                        }
                    })

                this.rerender()
            }
        ],
        [
            "select#subElement-select",
            "input",
            (e: InputEvent) => {
                const input = e.target as HTMLInputElement;
                const value = input.value;

                this.selectedElement = value;
            }
        ],
        [
            "[sub-element-option]",
            "click",
            (e: InputEvent) => {
                const input = e.target as HTMLInputElement;
                const value = input.dataset.value;

                this.selectedElement = value;
            }
        ],
        [
            "[data-component]",
            "click",
            this.handleToggleClick
        ],
        [
            window, "onnboarding:style-editor-switch", (e: EventDetail) => {
                const { tab } = e.detail;
                if(['styles', 'properties'].includes(tab)) {
                    this.componentToShow = tab
                }
            }
        ],
        [
            "button#handle-edit-label",
            "click",
            this.handleEditLabel
        ],
        [
            "input#label-edit-input",
            "input",
            (e: InputEvent) => {
                // HANDLE INPUT UPDATE AND EMIT TO COMPONENT
                const input = e.target as HTMLInputElement;
                const value = input.value;

                this.componentLabel = value;

                this.dispatch(`component:${this.component?.id}:label`, {
                    label: value
                })
            }
        ],
        [
            "button#delete-component",
            "click",
            (e) => {
                this.dispatch("canvas:component:delete")
            }
        ]
    ]

    css = () => `
    @unocss-placeholder;
    :host {}
    `
}