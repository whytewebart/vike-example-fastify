import Minze, { EventListeners, MinzeElement } from "minze";
import { nanoid } from "nanoid";
import css from "./properties.css?inline"
import definition from "@/quickinvoice/definition/components";

// @unocss-include
// DIMENSION TYPE DEFINITION
interface PropertyEditor {
    // CORE
    name: string;
    type: string;
    label: string;
    icon: string;
    description: string;
    // LAYER INSTANCE
    componentId: string;
    componentType: string;
    componentName?: string;
    styleEditor?: MinzeElement;
    html: () => string;
}

type PropertyPayload = {
    componentId: string;
    layerInstance?: MinzeElement;
    componentType: string;
}

// DIMENSION COMPONENT CLASS
class PropertyEditor {
    // DEFINE DEFAULT PROPERTIES
    properties: Record<string, any> = {}

    constructor(payload: PropertyPayload) {
        this.name = 'PropertyEditor';
        this.type = 'property';
        this.label = 'Property';
        this.icon = 'i-heroicons-arrows-pointing-out-20-solid';
        this.description = 'Edit the properties of the component.';

        // DEFINE COMPONENT ID
        this.componentId = payload.componentId || 'unset';
        this.componentType = payload.componentType || 'unset';
        // DEFINE STYLE EDITOR INSTANCE
        this.styleEditor = payload.layerInstance;

        // LOAD EVENT LISTENERS
        this.eventListeners.forEach(([target, event, handler]) => {
            if (typeof target === 'string' && target !== 'minze')
                // Listen to events on a specific element
                this.styleEditor?.select(target)?.addEventListener(event, handler);
            else { Minze.listen(event, handler) }
        })
    }

    // SET COMPONENT ID
    setComponent({ id, type, name }: { id: string, type: string, name?: string }) {
        this.componentId = id;
        this.componentType = type;
        this.componentName = name
    }

    // SET PROPERTIES
    setProperties(properties: typeof this.properties) {
        this.properties = properties;
    }

    // DEFINITION
    definition() {
        // IMPORT DEFINITION
        const _definition = Object.values(definition)
            .find(def => def.type == this.componentType);

        return _definition
    }

    html = () => {
        const def = this.definition();
        const properties = def?.properties;
        // PROPERTIES HTML
        const propHtml = properties?.map((prop) => {
            const stringify = (payload: any) => {
                if (typeof payload === 'object' || Array.isArray(payload)) {
                    return JSON.stringify(payload)
                }

                return payload
            }

            return /*html*/`
                <editor-input
                    type='${JSON.stringify(prop.type)}'
                    select-options='${JSON.stringify(prop.options) || []}'
                    label="${prop.name}"
                    ${
                        prop.type === 'boolean' &&
                        this.properties[prop.name] === true ? 'checked="true"' : ''
                    }
                    default-value='${stringify(this.properties[prop.name] || prop.defaultValue)}'
                    component-id="${this.componentId}"
                    ${ prop.helptext ? `helptext="${prop.helptext}"` : '' }
                    ${ prop.description ? `description="${prop.description}"` : '' }
                ></editor-input>
            `
        }).join('')
        // RETURN HTML TEMPLATE
        return this.componentId && this.componentId !== 'unset' ? /*html*/`
            <div class="header">
                <!-- <span>${this.componentId}</span> -->
                <h3>[${this.componentName}] component </h3>
                <p>${this.description}</p>
            </div>

            <div>
                ${propHtml}
            </div>

            <style>
                ${css}
            </style>
        ` : '';
    }

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
        ],
    ]
}

export default PropertyEditor;