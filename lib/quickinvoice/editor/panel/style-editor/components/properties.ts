import Minze, { Attrs, EventListeners, MinzeElement, Reactive } from "minze";
import css from "../styles/properties.css?inline"

// DIMENSION TYPE DEFINITION
export interface PropertiesEditor {
    properties: Record<string, any>;
    componentId: string
}

// DIMENSION COMPONENT CLASS
export class PropertiesEditor extends MinzeElement {

    attrs: Attrs = [
        'component-id',
        'type',
        [
            'properties', {}
        ]
    ]

    static observedAttributes = ['component-id', 'type']

    get definition() {
        return window.activeComponent.definition
    }

    stringify = (payload: any) => {
        if (typeof payload === 'object' || Array.isArray(payload)) {
            return JSON.stringify(payload)
        }

        return payload
    }

    html = () => /*html*/`
        ${
            this.definition?.properties?.map((prop) => /*html*/`
                <editor-input
                    type='${this.stringify(prop.type)}'
                    select-options='${JSON.stringify(prop.options) || []}'
                    label="${prop.name}"
                    ${prop.type === 'boolean' &&
                    this.properties[prop.name] === true ? 'checked="true"' : ''
                }
                    default-value='${this.stringify(this.properties[prop.name] || prop.defaultValue)}'
                    component-id="${this.componentId}"
                    ${prop.helptext ? `helptext="${prop.helptext}"` : ''}
                    ${prop.description ? `description="${prop.description}"` : ''}
                ></editor-input>
            `).join('')
        }

        <div class="p-4 text-center ${this.definition ? 'hidden' : ''}">
            <p class="text-gray-500 font-space-mono font-semibold">No properties available for this component.</p>
        </div>

        <div class="py-2"></div>
    `

    css = () => /*css*/`
        @unocss-placeholder ${css};
    `

    eventListeners: EventListeners = [
        [
            'input',
            'change',
            (e) => {
                const target = e.target as HTMLInputElement;
                const name = target.getAttribute('name');
                const value = target.value;

                console.log('Property change:', name, value);
            }
        ]
    ]

}