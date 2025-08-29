import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

// IMPORT ATOMS
import { EditorComponent } from '../../component';

export interface StyleEditor {
    component?: EditorComponent;
    selectedElement?: string;
    componentToShow?: "styles" | "properties";
    allowedProperties?: string[];

    editLabel: boolean;
    componentLabel?: string;
    selectedComponent: string | null;

    _cache_sections?: string
}

export class StyleEditor extends MinzeElement {

    reactive: Reactive = [
        'componentId',
        ["selectedElement", ''],
        ["componentToShow", "properties"],
        ['allowedProperties', []],
        ['editLabel', false],
        ['componentLabel', null],
        ['selectedComponent', null],

        '_cache_sections'
    ]

    get sections(): Pick<SubElement, 'key' | 'name'>[] {
        return JSON.parse(this._cache_sections || '[]')
    }

    watch: Watch = [['subElements', (newValue, oldValue, key, target) => {
        console.log(newValue, oldValue)
    }]]

    handleToggleClick = (event: Event) => {
        const target__ = event.target as HTMLDivElement;
        const target = target__.closest("[data-component]") as HTMLDivElement;
        const component = <"styles" | "properties">target.dataset.component;

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
                <div
                    class="${styles.column} ${this.selectedComponent && this.componentToShow === 'styles' ? 'bg-gray-100' : ''}" 
                    data-component="styles"
                >
                    <h3>Styles</h3>
                </div>
                <div
                    class="${styles.column} ${this.selectedComponent && this.componentToShow === 'properties' ? 'bg-gray-100' : ''}" data-component="properties"
                >
                    <h3>Properties</h3>
                </div>
            </div>
            <div
                class="p-2 px-4 bg-gray-50 border-b grid font-sans ${this.selectedComponent ? '' : 'hidden'}"
            >
                <div class="${this.editLabel ? 'mb-1' : ''}" flex="~ items-center">
                    <h3 class="font-space-mono font-semibold text-lg capitalize relative -left-1 ${this.editLabel ? 'hidden' : ''}">
                        [${this.componentLabel || this.component?.type + ' component'}]
                    </h3>

                    <input
                        type="text"
                        class="bg-white py-1.5 px-3 b-1 rounded-lg mr-1 ${this.editLabel ? '' : 'hidden'}"
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

        return /*html*/`
            <details
                open
                class="group b-b-1 ${!this.selectedComponent && this.sections.length > 0 ? 'hidden' : ''}"
            >
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
                    ${this.sections?.map(opt => /*html*/`
                            <li
                                sub-element-option
                                data-value="${opt.key}"
                                class="px-4 py-1 font-space-mono transition-all" hover="bg-gray-100 cursor-pointer tracking-.8 font-bold shadow z-1"
                            >
                                ${opt.name} ${this.selectedElement === opt.key ? '<b class="tracking-normal!">[Selected]</b>' : ''}
                            </li>
                        `).join('')
                    }
                </ul>
                <p
                    class="text-center py-2 bg-gray-50/20"
                    font="space-mono bold"
                ></p>
            </details>

            <div
                p="y-4 x-2"
                class="text-center bg-gray-50 ${!this.selectedComponent && this.sections.length > 0 ? '' : 'hidden'}"
            >
                <div>
                    <p class="text-gray-500 font-urbanist text-lg trackinng-tight font-semibold pb-1">
                        Styling not available for this component
                    </p>

                    <div border="1 blue-6" class="mx-4"></div>
                </div>
            </div>
        `;
    }

    toggleComponentToRender = () => {
        const properties = /*html*/`
                <properties-editor
                    component-id='${this.component?.id}'
                    type='${this.component?.type}'
                    properties='${JSON.stringify(this.component?.properties)}'
                    ${this.componentToShow === 'properties' && this.selectedComponent ? '' : 'hidden'}
                ></properties-editor>
            `

        const renderElement = (tag: string) => {
            if (!this.selectedComponent) return '';

            return /*html*/`
                    <${tag}
                        ${`component-id="${this.component?.id}"`}
                        ${this.component?.styles ? `styles='${JSON.stringify(this.component.styles)}'` : ''}
                        ${this.component?.subElements ? `elements='${JSON.stringify(this.component.subElements)}'` : ''}
                        ${this.selectedElement ? `sub-element="${this.selectedElement}"` : ''}
                    ></${tag}>
                `
        }


        return /*html*/`
                <div ${this.selectedComponent && this.componentToShow === 'styles' ? '' : 'hidden'}>
                    ${this.elementSelect()}
                    ${this.allowedProperties?.map(tag => renderElement(tag)).join('')}
                </div>

                ${properties}
            `
    }

    html = (): string => /*html*/`
        ${this.header()}
        ${this.toggleComponentToRender()}

        <div
            class="p-4 text-center bg-gray-50"
            ${this.selectedComponent ? 'hidden' : ''}
        >
            <p class="text-gray-500 font-urbanist text-lg font-semibold">
                Select a component to begin editing
            </p>
        </div>
    `

    eventListeners: EventListeners = [
        [
            window,
            'canvas:component:selected',
            async (e) => {
                const component_: HTMLElement = e.detail.component;
                var definition: ComponentDefinition | undefined;

                if (window.activeComponent?.definition) {
                    definition = window.activeComponent.definition
                } else {
                    await import('@/quickinvoice/definition')
                        .then(
                            ({ components, templates }) =>
                                ({ ...components, ...templates }))
                        .then((response) => {
                            definition = Object.values(response)
                                .find(def => def.type == component_?.getAttribute('type')!);
                            window.activeComponent.definition = definition!;
                        })
                }


                if (!component_) {
                    this.component = undefined;
                    this.selectedComponent = null;
                    this._cache_sections = undefined;
                    this.allowedProperties = undefined;

                    return;
                }

                this.component = e.detail.component;
                this.selectedComponent = this.component?.id!;
                this.componentLabel = this.component?.getAttribute('_label') || '';

                // SET STYLES
                if (definition) {
                    const ___ = definition.subElements
                        ?.filter(d => !d.hidden)
                        .map(({ key, name }) => ({ key, name })) || [];

                    this.allowedProperties = definition.styleSettings?.allowedProperties || [];

                    this._cache_sections = JSON.stringify(___)

                    if (definition.capabilities?.allowSubElementRoot) {
                        this._cache_sections = JSON.stringify([
                            {
                                key: 'host',
                                name: 'Root'
                            },
                            ...___
                        ])
                    }
                }

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
                if (['styles', 'properties'].includes(tab)) {
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