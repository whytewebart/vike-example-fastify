import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import Minze, { MinzeElement } from 'minze'

export interface StyleEditorBase {
    properties: string;

    componentId: string;
    subElement: string;
    elements?: Record<string, {
        styles?: Record<string, string>;
        properties?: Record<string, any>;
    }>,
    styles: Record<string, string>
}

export class StyleEditorBase extends MinzeElement {
    // ATTRIBUTES
    attrs: Attrs = [
        "component-id",
        ["sub-element", "host"],
        ["elements", {}],
        ["styles", {}]
    ]

    static observedAttributes = ['component-id', 'sub-element']

    get fields(): FieldConfig[] {
        return JSON.parse(this.properties);
    }

    get selectProp() {
        // if(!this.elements || typeof this.elements !== 'object')
        //     return {};

        const r = this.elements?.[this.subElement] ?? {};
        const s = this.styles;

        if (this.subElement === 'host' && s)
            return s;
        if (r && r.styles)
            return r.styles;

        return {}
    }

    updateProperties = (name: string, finalValue: string) => {
        const updated = this.fields.map(({ prop, value, ...rest }) => {
            var _value = value;
            if (prop === name) {
                _value = finalValue
            }

            return {
                prop,
                value: _value,
                ...rest
            }
        });

        this.properties = JSON.stringify(updated);
    }

    checkValidity = () => {

        const validateValue = (type: string, value: string) => {
            // REMOVE ANY TEXT
            if (type === 'number' || type === 'range') {
                const r = parseFloat(value.replace(/[^\d.]/g, ''));
                if (isNaN(r)) {
                    return type === 'range' ? '0' : '';
                }
                return r;
            }
            return value
        }

        const upToDate = this.fields.map(({ prop, ...rest }) => {
            var _value = this.selectProp[prop] ?? '';
            const inputs = <NodeListOf<HTMLInputElement>>this.selectAll(`input[prop=${prop}]`);

            inputs.forEach(input => {
                // IF INPUT IS RADIO OR CHECKBOX
                if (input.type === 'radio' || input.type === 'checkbox') {
                    input.checked = input.id === _value;
                }
                
                else if (input.type === 'file') {
                    // IF INPUT IS FILE, SET VALUE TO EMPTY STRING
                    input.value = '';
                }

                else {
                    input.value = validateValue(rest.type, _value).toString();
                }

            })

            return {
                ...rest,
                prop,
                value: _value
            }
        })

        this.properties = JSON.stringify(upToDate)
    }

    onReady() {
        this.checkValidity()
    }

    afterAttributeChange() {
        this.checkValidity()
    }
}
