import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

// IMPORT ATOMS
import { EditorComponent } from '../../component';
import PropertyEditor from './atoms/properties';

export interface StyleEditor {
    component?: EditorComponent;
    subElements?: SubElement[];
    selectedElement?: string;
    componentToShow?: "styles" | "properties"
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
        "selectedElement",
        ["componentToShow", "properties"]
    ]

    handleToggleClick = (event: Event) => {
        const target__ = event.target as HTMLDivElement;
        const target = target__.closest("[data-component]") as HTMLDivElement;
        const component = <"styles" | "properties">target.dataset.component;

        // console.log(event, target, component)

        this.componentToShow = component;
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
        `
    }

    // col-span-2

    // SELECT INPUT
    elementSelect = () =>/*html*/`
        <div class="bg-gray-50 px-4 py-2">
            <h3 class="font-space-mono font-semibold text-lg capitalize relative -left-1 mb-1 ${!this.component ? 'hidden' : ''}">[${this.component?.type}] component </h3>
            <div class="relative bg-white">
                <select
                    name="subElement"
                    id="subElement-select"
                    class="w-full px-3 py-2 border border-gray-300 rounded-none text-sm text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-2 focus:ring-gray-200 font-urbanist appearance-none w-full"
                >
                    <option
                        value=""
                        disabled
                        selected
                    >Select Sub-Element</option>

                    <!-- <option
                        value="host"
                    >Root</option> -->
                    
                    ${this.subElements?.map(opt => `<option value="${opt.key}" class="">${opt.name}</option>`).join('')}
                </select>
                <span class="i-solar-alt-arrow-down-outline ml-1 absolute top-2.2 right-4 text-slate-700 text-xl"></span>
            </div>
        </div>
    `

    toggleComponentToRender = () => {
        if(this.component) {
            if (this.componentToShow === 'properties') {
                return this.property.html()
            }

            return /*html*/`
                ${this.elementSelect()}
                <dimension-editor
                    ${this.component?.id ? `component-id="${this.component.id}"` : ''}
                    ${this.component?.styles ? `styles='${JSON.stringify(this.component.styles)}'` : ''}
                    ${this.component?.subElements ? `elements='${JSON.stringify(this.component.subElements)}'` : ''}
                    ${this.selectedElement ? `sub-element="${this.selectedElement}"` : ''}
                ></dimension-editor>
            `
        }

        return ``
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
                const componentProps = this.component?.getAttribute('properties')

                // SET COMPONENT ON PROPERTY CLASS
                this.property.setComponent({
                    id: componentId,
                    type: componentType!,
                });

                this.property.setProperties(JSON.parse(componentProps || '{}'))
                // this.dimensions.setComponent(this.component!)
                // SET STYLES
                await import('../../component/utils/definition')
                    .then((response) => {
                        const definition = Object.values(response.default)
                            .find(def => def.type == componentType!);

                        if (definition) {
                            this.subElements = definition.subElements || []
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
            "[data-component]",
            "click",
            this.handleToggleClick
        ]
    ]

    css = () => `
    @unocss-placeholder;
    :host {}
    `
}