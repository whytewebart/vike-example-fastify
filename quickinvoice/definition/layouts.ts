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
            <editor-component slot="columna" type="paragraph" properties='{"text":"${new Date().toDateString()}"}' styles='{"padding-top":"10px"}'></editor-component>
            <editor-component slot="columna" type="dropzone" properties="{}" styles='{"padding":"none","padding-top":"25px"}'>
                <editor-component type="heading" properties='{"level":"h3","text":"Office Address"}' styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
                <editor-component type="paragraph" properties='${JSON.stringify({"text":"63 Buttonwood Ave, \nHelena, Montana, 88162"})}'></editor-component>
                <editor-component type="paragraph" properties='{"text":"+1 (234) 567 8901"}' styles='{"padding-top":"10px","font-weight": "700","font-size":"15px"}'></editor-component>
            </editor-component>

            <editor-component slot="columnb" type="heading" properties='{"level":"h2","text":"Invoice"}' styles='${JSON.stringify(header1_props.invoice.styles)}'></editor-component>
            <editor-component slot="columnb" type="paragraph" properties='{"text":"NO: ${nanoid(9).toLowerCase()}"}' styles='{"text-align":"right"}'></editor-component>
            <editor-component slot="columnb" type="dropzone" properties="{}" styles='{"padding":"none","padding-top":"15px"}'>
                <editor-component type="heading" properties='{"level":"h3","text":"Receipient"}' styles='{"text-align":"right","text-transform": "uppercase","font-weight": "700"}'></editor-component>
                <editor-component type="paragraph" properties='{"text":"+234 567 8901"}' styles='{"text-align":"right"}'></editor-component>
                <editor-component type="paragraph" properties='{"text":"hello@example.com"}' styles='{"text-align":"right"}'></editor-component>
                <editor-component type="paragraph" properties='${JSON.stringify({"text":"1639 Glenwood Hwy, 3rd FL, \nBoise, Idaho, 75518"})}' styles='{"text-align":"right"}'></editor-component>
            </editor-component>
        </editor-component>
    `
}

const disclaimer = {
    id: 'disclaimer',
    html: /*html*/`
        <editor-component type="paragraph" properties='${JSON.stringify({ text: 'This invoice is issued based on the information provided at the time of transaction. All amounts are due in full by the payment due date listed above. Late payments may be subject to additional fees or interest charges. Please verify all details carefully. If you have any questions or believe there is an error, contact us within 5 business days of the invoice date.' })}'></editor-component>
    `
}

const paymentTerms = {
    id: 'payment-terms',
    html: /*html*/`
        <editor-component type="dropzone" properties="{}" styles='{"padding":"none"}'>
            <editor-component type="heading" properties='{"level":"h3","text":"Payment Terms"}' styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
            <editor-component type="paragraph" properties='${JSON.stringify({
                text: "Payment can be made via bank transfer, credit card, or PayPal. Please refer to the payment details provided.\n\nNote: Please include the invoice number in the payment reference to ensure proper processing.\n\nFor any questions or to discuss alternative payment arrangements, please contact us at contact@business.com or (111) 222-3333"
            })}'></editor-component>
        </editor-component>
    `
}


const issuedBy = {
    id: 'issued-by',
    html: /*html*/`
        <editor-component type="dropzone" properties="{}">
            <editor-component type="heading" properties='{"level":"h4","text":"Issued By"}' styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
            <editor-component type="signature" properties='{"useCapture":"true","size":"130"}'></editor-component>
            <editor-component type="paragraph" properties='${JSON.stringify({ text: `Evelyn Smith\n${new Date().toLocaleDateString()}` })}'></editor-component>
        </editor-component>
    `
}

export default {
    header1,
    disclaimer,
    paymentTerms,
    issuedBy
}