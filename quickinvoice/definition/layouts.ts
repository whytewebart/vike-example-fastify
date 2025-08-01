import { nanoid } from "nanoid"
import invoicespace_logo from "@/quickinvoice/assets/invoicespace.logo.svg"

// Libary
const header1_props = {
    root: {
        prop: {
            direction: 'row',
            justify: 'space-between'
        },
        "sub-elements": {
            columna: {
                styles: {
                    'background-color': 'transparent',
                    'padding': '0px',
                    'flex': 'none'
                }
            },
            columnb: {
                styles: {
                    'background-color': 'transparent',
                    'padding': '0px',
                    'flex': 'none',
                    'display': 'flex',
                    'flex-direction': 'column',
                    'align-items': 'end'
                }
            },
        },
        styles: {}
    },

    logo: {
        styles: {
            "width": "150px"
        }
    },

    invoice: {
        styles: {
            "text-transform": "uppercase",
            "font-weight": "700",
            "text-align": "right",
            "display": "flex",
            "height": "21px",
            "align-items": "center"
        }
    }
}
const header1 = {
    id: 'header-first',
    html: /*html*/`
        <editor-component type="column-grid" properties='${JSON.stringify(header1_props.root.prop)}' sub-elements='${JSON.stringify(header1_props.root["sub-elements"])}' styles='${JSON.stringify(header1_props.root.styles)}'>
            <editor-component slot="columna" type="image" properties='{"src":"${invoicespace_logo}"}' styles='${JSON.stringify(header1_props.logo.styles)}'></editor-component>

            <editor-component slot="columnb" type="heading" properties='{"level":"h2","text":"Invoice"}' styles='${JSON.stringify(header1_props.invoice.styles)}'></editor-component>
            <editor-component slot="columnb" type="paragraph" properties='{"text":"#${nanoid(9)}"}' styles='{"text-align":"right"}'></editor-component>
        </editor-component>
    `
}

export default {
    header1
}