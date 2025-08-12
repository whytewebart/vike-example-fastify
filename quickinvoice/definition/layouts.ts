import { nanoid } from "nanoid"
import invoicespace_logo from "@/quickinvoice/assets/invoicespace.logo.svg"

type LayoutDefinition = {
    id: string,
    html?: string,
    schema: {
        type: string,
        properties: Record<string, any>,
        styles?: Record<string, any>,
        subElements?: Record<string, any>,
        children?: Array<{
            type: string,
            properties: Record<string, any>,
            styles?: Record<string, any>,
            children?: Array<any>,
            selector?: string,
            subElements?: Record<string, any>
        }>
    }
}

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
        styles: {
            "margin-top": "15px",
            "margin-bottom": "15px",
            "margin-right": "15px",
            "margin-left": "15px",
        }
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
            // "height": "21px",
            "align-items": "center"
        }
    }
}

const header1_schema = {
  type: "column-grid",
  properties: header1_props.root.prop,
  subElements: header1_props.root["sub-elements"],
  styles: header1_props.root.styles,
  children: [
    {
      selector: "[dropzone-column-1]",
      type: "image",
      properties: { src: invoicespace_logo },
      styles: header1_props.logo.styles
    },
    {
      selector: "[dropzone-column-1]",
      type: "paragraph",
      properties: { text: new Date().toDateString() },
      styles: { "padding-top": "10px" }
    },
    {
      selector: "[dropzone-column-1]",
      type: "dropzone",
      properties: {},
      styles: { padding: "none", "padding-top": "25px" },
      children: [
        {
          type: "heading",
          properties: { level: "h3", text: "Office Address" },
          styles: { "text-transform": "uppercase", "font-weight": "700" }
        },
        {
          type: "paragraph",
          properties: { text: "63 Buttonwood Ave, \nHelena, Montana, 88162" }
        },
        {
          type: "paragraph",
          properties: { text: "+1 (234) 567 8901" },
          styles: {
            "padding-top": "10px",
            "font-weight": "700",
            "font-size": "15px"
          }
        }
      ]
    },
    {
      selector: "[dropzone-column-2]",
      type: "heading",
      properties: { level: "h2", text: "Invoice" },
      styles: header1_props.invoice.styles
    },
    {
      selector: "[dropzone-column-2]",
      type: "paragraph",
      properties: { text: `NO: ${nanoid(9).toLowerCase()}` },
      styles: { "text-align": "right" }
    },
    {
      selector: "[dropzone-column-2]",
      type: "dropzone",
      properties: {},
      styles: { padding: "none", "padding-top": "15px" },
      children: [
        {
          type: "heading",
          properties: { level: "h3", text: "Receipient" },
          styles: {
            "text-align": "right",
            "text-transform": "uppercase",
            "font-weight": "700"
          }
        },
        {
          type: "paragraph",
          properties: { text: "+234 567 8901" },
          styles: { "text-align": "right" }
        },
        {
          type: "paragraph",
          properties: { text: "hello@example.com" },
          styles: { "text-align": "right" }
        },
        {
          type: "paragraph",
          properties: {
            text: "1639 Glenwood Hwy, 3rd FL, \nBoise, Idaho, 75518"
          },
          styles: { "text-align": "right" }
        }
      ]
    }
  ]
}


const header1 = {
    id: 'header-first',
    html: /*html*/`
        <editor-component type="column-grid" _properties='${JSON.stringify(header1_props.root.prop)}' _sub-elements='${JSON.stringify(header1_props.root["sub-elements"])}' _styles='${JSON.stringify(header1_props.root.styles)}'>
            <editor-component slot="columna" type="image" _properties='{"src":"${invoicespace_logo}"}' _styles='${JSON.stringify(header1_props.logo.styles)}'></editor-component>
            <editor-component slot="columna" type="paragraph" _properties='{"text":"${new Date().toDateString()}"}' _styles='{"padding-top":"10px"}'></editor-component>
            <editor-component slot="columna" type="dropzone" _properties="{}" _styles='{"padding":"none","padding-top":"25px"}'>
                <editor-component type="heading" _properties='{"level":"h4","text":"Office Address"}' _styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
                <editor-component type="paragraph" _properties='${JSON.stringify({"text":"63 Buttonwood Ave, \nHelena, Montana, 88162"})}'></editor-component>
                <editor-component type="paragraph" _properties='{"text":"+1 (234) 567 8901"}' _styles='{"padding-top":"10px","font-weight": "700","font-size":"15px"}'></editor-component>
            </editor-component>

            <editor-component slot="columnb" type="heading" _properties='{"level":"h3","text":"Invoice"}' _styles='${JSON.stringify(header1_props.invoice.styles)}'></editor-component>
            <editor-component slot="columnb" type="paragraph" _properties='{"text":"NO: ${nanoid(9).toLowerCase()}"}' _styles='{"text-align":"right"}'></editor-component>
            <editor-component slot="columnb" type="dropzone" _properties="{}" _styles='{"padding":"none","padding-top":"15px"}'>
                <editor-component type="heading" _properties='{"level":"h4","text":"Receipient"}' _styles='{"text-align":"right","text-transform": "uppercase","font-weight": "700"}'></editor-component>
                <editor-component type="paragraph" _properties='{"text":"+234 567 8901"}' _styles='{"text-align":"right"}'></editor-component>
                <editor-component type="paragraph" _properties='{"text":"hello@example.com"}' _styles='{"text-align":"right"}'></editor-component>
                <editor-component type="paragraph" _properties='${JSON.stringify({"text":"1639 Glenwood Hwy, 3rd FL, \nBoise, Idaho, 75518"})}' _styles='{"text-align":"right"}'></editor-component>
            </editor-component>
        </editor-component>
    `,
    schema: header1_schema
}

const disclaimer: LayoutDefinition = {
    id: 'disclaimer',
    html: /*html*/`
        <editor-component type="paragraph" _properties='${JSON.stringify({ text: 'This invoice is issued based on the information provided at the time of transaction. All amounts are due in full by the payment due date listed above. Late payments may be subject to additional fees or interest charges. Please verify all details carefully. If you have any questions or believe there is an error, contact us within 5 business days of the invoice date.' })}'></editor-component>
    `,
    schema: {
        type: "paragraph",
        properties: {
            text: "This invoice is issued based on the information provided at the time of transaction. All amounts are due in full by the payment due date listed above. Late payments may be subject to additional fees or interest charges. Please verify all details carefully. If you have any questions or believe there is an error, contact us within 5 business days of the invoice date."
        }
    }
}

const paymentTerms: LayoutDefinition = {
    id: 'payment-terms',
    html: /*html*/`
        <editor-component type="dropzone" _properties="{}" _styles='{"padding":"none"}'>
            <editor-component type="heading" _properties='{"level":"h3","text":"Payment Terms"}' _styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
            <editor-component type="paragraph" _properties='${JSON.stringify({
                text: "Payment can be made via bank transfer, credit card, or PayPal. Please refer to the payment details provided.\n\nNote: Please include the invoice number in the payment reference to ensure proper processing.\n\nFor any questions or to discuss alternative payment arrangements, please contact us at contact@business.com or (111) 222-3333"
            })}'></editor-component>
        </editor-component>
    `,
    schema: {
        type: "dropzone",
        properties: {},
        styles: { padding: "none" },
        children: [
            {
                type: "heading",
                properties: { level: "h3", text: "Payment Terms" },
                styles: { "text-transform": "uppercase", "font-weight": "700" }
            },
            {
                type: "paragraph",
                properties: {
                    text: "Payment can be made via bank transfer, credit card, or PayPal. Please refer to the payment details provided.\n\nNote: Please include the invoice number in the payment reference to ensure proper processing.\n\nFor any questions or to discuss alternative payment arrangements, please contact us at contact@business.com or (111) 222-3333"
                }
            }
        ]
    }
}

const issuedBy: LayoutDefinition = {
    id: 'issued-by',
    html: /*html*/`
        <editor-component _label="Issued By" type="dropzone" _properties="{}">
            <editor-component type="heading" _properties='{"level":"h4","text":"Issued By"}' _styles='{"text-transform": "uppercase","font-weight": "700"}'></editor-component>
            <editor-component type="signature" _properties='{"useCapture":"true","size":"130"}'></editor-component>
            <editor-component type="paragraph" _properties='${JSON.stringify({ text: `Evelyn Smith\n${new Date().toLocaleDateString()}` })}'></editor-component>
        </editor-component>
    `,
    schema: {
        type: "dropzone",
        properties: {},
        children: [
            {
                type: "heading",
                properties: { level: "h4", text: "Issued By" },
                styles: { "text-transform": "uppercase", "font-weight": "700" }
            },
            {
                type: "signature",
                properties: { useCapture: "true", size: "130" }
            },
            {
                type: "paragraph",
                properties: { text: `Evelyn Smith\n${new Date().toLocaleDateString()}` }
            }
        ]
    }
}

const footer_styles = {
    dropzone: {
        display: 'flex',
        padding: 'none',
        "column-gap": "10px",
        "margin-top": "10px"
    },
    nopadding: {
        padding: 'none',
        'display': 'flex',
        'flex-direction': 'column',
        'flex': '1'
    }
}

const footer = {
    id: 'footer-01',
    html: /*html*/`
    <editor-component type="dropzone" _styles='{"padding":"10px"}'>
        <editor-component type="heading" _properties='{"level":"h4","text":"Thank you for your Business"}'></editor-component>
        <editor-component type="dropzone" _styles='${JSON.stringify(footer_styles.dropzone)}'>
            <editor-component type="dropzone" _styles='${JSON.stringify(footer_styles.nopadding)}'>
                <editor-component type="heading" _properties='{"level":"h4", "text":"Questions?"}'></editor-component>
                <editor-component type="paragraph" _properties='${JSON.stringify({
                    text: "Email us: e.company@mail.site\nCall us : +628 123 456 789"
                })}'></editor-component>
            </editor-component>
            <editor-component type="dropzone" _styles='${JSON.stringify(footer_styles.nopadding)}'>
                <editor-component type="heading" _properties='{"level":"h4", "text":"Payment Info :"}'></editor-component>
                <editor-component type="paragraph" _properties='${JSON.stringify({
                    text: "Account : 1234 567 890\nA/C Name : Bank of System\nBank Detail : Bank Pvt.ltd"
                })}'></editor-component>
            </editor-component>
            <editor-component type="dropzone" _styles='${JSON.stringify(footer_styles.nopadding)}'>
                <editor-component type="heading" _properties='{"level":"h4", "text":"Terms & Conditions :"}'></editor-component>
                <editor-component type="paragraph" _properties='${JSON.stringify({
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt."
                })}'></editor-component>
            </editor-component>
        </editor-component>
    </editor-component>
    `
}

export default {
    header1,
    disclaimer,
    paymentTerms,
    issuedBy,
    footer
}