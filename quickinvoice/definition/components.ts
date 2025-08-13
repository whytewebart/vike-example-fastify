import { nanoid } from "nanoid";
import tableStylesCss from './styles/fixedtable.css?inline'

const button: ComponentDefinition = {
    type: 'button',
    name: 'Button',
    category: 'Actions',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true
    },

    properties: [
        {
            name: 'label',
            type: 'text',
            defaultValue: 'Button'
        },
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'primary',
            options: ['primary', 'secondary', 'text', 'clear']
        },
        {
            name: 'disabled',
            type: 'boolean',
            defaultValue: false
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'background-editor',
            'spacing-editor',
        ],
        defaultStyles: {
            'padding': '8px 16px',
            'border-radius': '4px',
            'color': '#ffffff',
            'font-family': 'Urbanist, sans-serif',
        },
        css(properties) {
            return /*css*/`
                [styles=host] {
                    width: fit-content
                }

                div[disabled] {
                    background-color: #cccccc !important;
                    color: #666666 !important;
                }

                /* STYLE VARIANTS */
                [styles=host][variant=primary] {
                    background-color: #4CAF50;
                    color: #ffffff;
                }

                [styles=host][variant=secondary] {
                    background-color: #007bff;
                    color: #ffffff;
                }

                [styles=host][variant=text] {
                    background-color: transparent;
                    color: #12161aff;
                }
            `;
        },
    },

    renderTemplate: (properties) => /*html*/ `
    <div styles="host" ${properties.disabled ? 'disabled' : ''} variant="${properties.variant}">${properties.label}</div> 
  `
};

const dropzone: ComponentDefinition = {
    type: 'dropzone',
    name: 'Dropzone',
    category: 'Layout',
    icon: '🎯',

    capabilities: {
        canHaveChildren: true,
        canBeDeleted: true,
        canAcceptStyles: true,
        isContainer: true,
        enableHandle: true
    },

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'spacing-editor',
            'background-editor',
            'layout-editor',
            'stack-editor'
        ],
        defaultStyles: {
            'padding': '10px'
        },
        css: (properties) => /*css*/`

            slot {
                display: block
            }
        `
    },

    properties: [],
    subElements: [],
    defaultChildren: [],
    renderTemplate: (properties) => /*html*/`
        <div styles="host" dropzone><slot styles="host"></slot></div>
    `
};

const heading: ComponentDefinition = {
    type: 'heading',
    name: 'Heading',
    category: 'Typography',
    icon: 'H',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'level',
            type: 'select',
            defaultValue: 'h1',
            options: ['h1', 'h2', 'h3', 'h4', 'h5']
        },
        {
            name: 'text',
            type: 'text',
            defaultValue: 'Heading Text'
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'spacing-editor'
        ],
        defaultStyles: {
            'font-weight': '800'
        },
        css: (properties) => /*css*/`
            :host, h1, h2, h3, h4, h5, h6 {
                display: block;
                font-family: 'Urbanist';
            }
            /* h1, [tag="h1"] { font-size: 32pt; }
            h2, [tag="h2"] { font-size: 24pt; }
            h3, [tag="h3"] { font-size: 16pt; }
            h4, [tag="h4"] { font-size: 14pt; }
            h5, [tag="h5"] { font-size: 12pt; }
            h6, [tag="h6"] { font-size: 10pt; } */
            h1, [tag="h1"] { font-size: 24pt; }
            h2, [tag="h2"] { font-size: 18pt; }
            h3, [tag="h3"] { font-size: 14pt; }
            h4, [tag="h4"] { font-size: 12pt; }
            h5, [tag="h5"] { font-size: 10pt; }
            h6, [tag="h6"] { font-size: 10pt; }
        `
    },

    renderTemplate: (properties) => {
        const level = properties.level || 'h1';
        return `<${level} styles="host">${properties.text}</${level}>`;
    }
};

const paragraph: ComponentDefinition = {
    type: 'paragraph',
    name: 'Paragraph',
    category: 'Typography',
    icon: 'P',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'text',
            type: "rich-text",
            defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'spacing-editor'
        ],
        defaultStyles: {
        },
        css: (properties) => /*css*/`
            :host, p {
                display: block;
                font-family: 'Urbanist';
            }

            p {
                white-space: pre-wrap;
                line-height: 1.5,
                color: #333333;
                font-size: 8pt;
            }
        `
    },

    renderTemplate: (properties) => `<p styles="host">${properties.text}</p>`
};

const telephone: ComponentDefinition = {
    type: 'telephone',
    name: 'Phone Number',
    category: 'Typography',
    icon: 'T',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'phoneNumber',
            type: "tel",
            defaultValue: '+1 234 567 8901'
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'spacing-editor'
        ],
        defaultStyles: {
        },
        css: (properties) => /*css*/`
            :host, p {
                display: block;
                font-family: 'Urbanist';
            }

            p {
                white-space: pre-wrap;
                line-height: 1.5,
                color: #333333;
                font-size: 10pt;
            }
        `
    },

    renderTemplate: (properties) => `<p styles="host">${properties.phoneNumber}</p>`
};

const divider: ComponentDefinition = {
    type: 'divider',
    name: 'Divider',
    category: 'Layout',
    icon: '---',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'thickness',
            type: 'number',
            defaultValue: 1
        },
        {
            name: 'color',
            type: 'color',
            defaultValue: '#ccc'
        },
        {
            name: 'style',
            type: 'select',
            defaultValue: 'solid',
            options: ['solid', 'dashed', 'dotted', 'double']
        },
        {
            name: 'width',
            type: 'number',
            defaultValue: 100
        },
        {
            name: 'unit',
            type: 'select',
            defaultValue: '%',
            options: [
                'px',
                '%',
                'cm',
                'in'
            ]
        }
    ],

    styleSettings: {
        allowedProperties: [
            'spacing-editor',
            'background-editor'
        ],
        defaultStyles: {
            'padding-top': '10px',
            'padding-bottom': '10px',
            'width': '100%'
        },
        css: (properties) => /*css*/`
        `
    },

    renderTemplate: (properties) => /*html*/`
        <div styles="host">
            <hr style="
                border: none;
                border-top-width: ${properties.thickness}pt;
                border-top-color: ${properties.color};
                border-top-style: ${properties.style};
                width: ${properties.width}${properties.unit};
            " />
        </div>
    `
};

// ADD IMAGE COMPONENT
const image: ComponentDefinition = {
    type: 'image',
    name: 'Image',
    category: 'Media',
    icon: '🖼️',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'src',
            type: 'image',
            defaultValue: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0RERERERCIvPjxwYXRoIGZpbGw9IiM5OTk5OTkiIGQ9Ik00Ni42OCAxMDYuNjZoNS4wMXEuNTQgMCAuODYuM3QuMzIuOHYySDM5LjQ4di0xLjExcTAtLjMzLjE0LS43MS4xNC0uMzcuNDUtLjY2bDUuOTMtNS45NHEuNzQtLjc2IDEuMzMtMS40NS41OC0uNjkuOTctMS4zNi40LS42OC42LTEuMzcuMjEtLjcuMjEtMS40NyAwLS43LS4yLTEuMjMtLjItLjU0LS41Ny0uOXQtLjg5LS41NXEtLjUyLS4xOC0xLjE3LS4xOC0uNTkgMC0xLjEuMTd0LS45LjQ3cS0uMzkuMzEtLjY2LjcxLS4yNy40MS0uNDEuODktLjIyLjYyLS41OS44My0uMzYuMi0xLjA1LjA5bC0xLjc2LS4zMXEuMjEtMS40Ljc5LTIuNDZ0MS40NS0xLjc3IDEuOTktMS4wN3ExLjEzLS4zNiAyLjQzLS4zNiAxLjM1IDAgMi40Ny40dDEuOTIgMS4xM3EuNzkuNzMgMS4yNCAxLjc1LjQ0IDEuMDMuNDQgMi4yOCAwIDEuMDgtLjMxIDItLjMyLjkyLS44NSAxLjc2LS41NC44NC0xLjI1IDEuNjItLjcyLjc4LTEuNSAxLjU5bC00LjQgNC41cS42My0uMTkgMS4yNi0uMjl0MS4xOS0uMU02OS4wOSAxMDBxMCAyLjU1LS41NCA0LjQzLS41NSAxLjg5LTEuNTEgMy4xMi0uOTcgMS4yMi0yLjI5IDEuODMtMS4zMS42LTIuODQuNi0xLjUyIDAtMi44My0uNi0xLjMtLjYxLTIuMjYtMS44My0uOTYtMS4yMy0xLjUtMy4xMi0uNTQtMS44OC0uNTQtNC40MyAwLTIuNTcuNTQtNC40NC41NC0xLjg4IDEuNS0zLjExdDIuMjYtMS44M3ExLjMxLS42IDIuODMtLjYgMS41MyAwIDIuODQuNiAxLjMyLjYgMi4yOSAxLjgzLjk2IDEuMjMgMS41MSAzLjExLjU0IDEuODcuNTQgNC40NG0tMy40NCAwcTAtMi4xMi0uMzEtMy41MXQtLjgzLTIuMjFxLS41Mi0uODMtMS4xOS0xLjE2LS42OC0uMzMtMS40MS0uMzMtLjcxIDAtMS4zOC4zM3QtMS4xOCAxLjE2cS0uNTIuODItLjgyIDIuMjF0LS4zIDMuNTEuMyAzLjUxLjgyIDIuMjFxLjUxLjgzIDEuMTggMS4xNnQxLjM4LjMzcS43MyAwIDEuNDEtLjMzLjY3LS4zMyAxLjE5LTEuMTYuNTItLjgyLjgzLTIuMjF0LjMxLTMuNTFtMTkuMSAwcTAgMi41NS0uNTQgNC40My0uNTUgMS44OS0xLjUxIDMuMTItLjk3IDEuMjItMi4yOSAxLjgzLTEuMzEuNi0yLjg0LjYtMS41MiAwLTIuODMtLjYtMS4zLS42MS0yLjI2LTEuODMtLjk2LTEuMjMtMS41LTMuMTItLjU0LTEuODgtLjU0LTQuNDMgMC0yLjU3LjU0LTQuNDQuNTQtMS44OCAxLjUtMy4xMXQyLjI2LTEuODNxMS4zMS0uNiAyLjgzLS42IDEuNTMgMCAyLjg0LjYgMS4zMi42IDIuMjkgMS44My45NiAxLjIzIDEuNTEgMy4xMS41NCAxLjg3LjU0IDQuNDRtLTMuNDQgMHEwLTIuMTItLjMxLTMuNTF0LS44My0yLjIxcS0uNTItLjgzLTEuMTktMS4xNi0uNjgtLjMzLTEuNDEtLjMzLS43MSAwLTEuMzguMzN0LTEuMTggMS4xNnEtLjUyLjgyLS44MiAyLjIxdC0uMyAzLjUxLjMgMy41MS44MiAyLjIxcS41MS44MyAxLjE4IDEuMTZ0MS4zOC4zM3EuNzMgMCAxLjQxLS4zMy42Ny0uMzMgMS4xOS0xLjE2LjUyLS44Mi44My0yLjIxdC4zMS0zLjUxbTI0Ljg4IDUuMjktMS43NyAxLjc0LTQuNTctNC41Ny00LjYyIDQuNi0xLjc3LTEuNzQgNC42Mi00LjYzLTQuNC00LjQgMS43NS0xLjc2IDQuNCA0LjQgNC4zOC00LjM3IDEuNzggMS43NS00LjM5IDQuMzl6bTE2LjI2IDEuMzdoNXEuNTQgMCAuODYuM3QuMzIuOHYyaC0xMy4zOXYtMS4xMXEwLS4zMy4xNC0uNzEuMTQtLjM3LjQ1LS42Nmw1LjkzLTUuOTRxLjc0LS43NiAxLjMzLTEuNDUuNTgtLjY5Ljk4LTEuMzYuMzktLjY4LjYtMS4zNy4yMS0uNy4yMS0xLjQ3IDAtLjctLjIxLTEuMjMtLjItLjU0LS41Ny0uOXQtLjg5LS41NXEtLjUyLS4xOC0xLjE3LS4xOC0uNTkgMC0xLjEuMTd0LS45LjQ3cS0uMzkuMzEtLjY2LjcxLS4yNy40MS0uNC44OS0uMjMuNjItLjYuODMtLjM2LjItMS4wNS4wOWwtMS43Ni0uMzFxLjIxLTEuNC43OS0yLjQ2dDEuNDUtMS43NyAyLTEuMDdxMS4xMi0uMzYgMi40Mi0uMzYgMS4zNSAwIDIuNDcuNHQxLjkyIDEuMTNxLjc5LjczIDEuMjQgMS43NS40NCAxLjAzLjQ0IDIuMjggMCAxLjA4LS4zMSAyLS4zMi45Mi0uODUgMS43Ni0uNTQuODQtMS4yNSAxLjYyLS43Mi43OC0xLjUgMS41OWwtNC40IDQuNXEuNjMtLjE5IDEuMjYtLjI5dDEuMi0uMW0yMi40MS02LjY2cTAgMi41NS0uNTUgNC40My0uNTUgMS44OS0xLjUxIDMuMTItLjk3IDEuMjItMi4yOCAxLjgzLTEuMzIuNi0yLjg1LjYtMS41MiAwLTIuODItLjYtMS4zMS0uNjEtMi4yNy0xLjgzLS45NS0xLjIzLTEuNDktMy4xMi0uNTQtMS44OC0uNTQtNC40MyAwLTIuNTcuNTQtNC40NC41NC0xLjg4IDEuNDktMy4xMS45Ni0xLjIzIDIuMjctMS44MyAxLjMtLjYgMi44Mi0uNiAxLjUzIDAgMi44NS42IDEuMzEuNiAyLjI4IDEuODMuOTYgMS4yMyAxLjUxIDMuMTEuNTUgMS44Ny41NSA0LjQ0bS0zLjQ1IDBxMC0yLjEyLS4zMS0zLjUxdC0uODMtMi4yMXEtLjUyLS44My0xLjE5LTEuMTYtLjY4LS4zMy0xLjQxLS4zMy0uNzEgMC0xLjM4LjMzdC0xLjE4IDEuMTZxLS41MS44Mi0uODIgMi4yMS0uMyAxLjM5LS4zIDMuNTF0LjMgMy41MXEuMzEgMS4zOS44MiAyLjIxLjUxLjgzIDEuMTggMS4xNnQxLjM4LjMzcS43MyAwIDEuNDEtLjMzLjY3LS4zMyAxLjE5LTEuMTYuNTItLjgyLjgzLTIuMjF0LjMxLTMuNTFtMTkuMTEgMHEwIDIuNTUtLjU1IDQuNDMtLjU1IDEuODktMS41MSAzLjEyLS45NyAxLjIyLTIuMjggMS44My0xLjMyLjYtMi44NS42LTEuNTIgMC0yLjgyLS42LTEuMzEtLjYxLTIuMjctMS44My0uOTUtMS4yMy0xLjQ5LTMuMTItLjU0LTEuODgtLjU0LTQuNDMgMC0yLjU3LjU0LTQuNDQuNTQtMS44OCAxLjQ5LTMuMTEuOTYtMS4yMyAyLjI3LTEuODMgMS4zLS42IDIuODItLjYgMS41MyAwIDIuODUuNiAxLjMxLjYgMi4yOCAxLjgzLjk2IDEuMjMgMS41MSAzLjExLjU1IDEuODcuNTUgNC40NG0tMy40NSAwcTAtMi4xMi0uMzEtMy41MXQtLjgzLTIuMjFxLS41Mi0uODMtMS4xOS0xLjE2LS42OC0uMzMtMS40MS0uMzMtLjcxIDAtMS4zOC4zM3QtMS4xOCAxLjE2cS0uNTEuODItLjgyIDIuMjEtLjMgMS4zOS0uMyAzLjUxdC4zIDMuNTFxLjMxIDEuMzkuODIgMi4yMS41MS44MyAxLjE4IDEuMTZ0MS4zOC4zM3EuNzMgMCAxLjQxLS4zMy42Ny0uMzMgMS4xOS0xLjE2LjUyLS44Mi44My0yLjIxdC4zMS0zLjUxIi8+PC9zdmc+'
        },
        {
            name: 'alt',
            type: 'text',
            defaultValue: ''
        },
        {
            name: 'caption',
            type: 'text',
            defaultValue: ''
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'layout-editor',
            'spacing-editor',
        ],
        defaultStyles: {},
        css: (properties) => /*css*/`
            img[src=""] {
                background-color: #f0f0f0;
                max-width: 100%;
                height: auto;
            }
        `
    },

    renderTemplate: (properties) => /*html*/`
        <figure>
            <img styles="host" src="${properties.src}" alt="${properties.alt}" />
            ${properties.caption ? `<figcaption>${properties.caption}</figcaption>` : ''}
        </figure>
    `
}

// ADD QRCODE COMPONENT
const qrcode: ComponentDefinition = {
    type: 'qrcode',
    name: 'QR Code',
    category: 'Media',
    icon: '📱',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true
    },

    properties: [
        {
            name: 'value',
            type: 'text',
            defaultValue: 'https://example.com',
            description: 'The data to encode in the QR code.'
        },
        {
            name: 'size',
            type: 'number',
            defaultValue: 128,
            description: 'The size of the QR code in pixels (width and height).'
        },
        {
            name: 'margin',
            type: 'number',
            defaultValue: 1
        },
        {
            name: 'foreground',
            type: 'color',
            defaultValue: '#000000',
        },
        {
            name: 'background',
            type: 'color',
            defaultValue: '#ffffff',
        }
    ],

    styleSettings: {
        allowedProperties: [
            'spacing-editor'
        ],
        defaultStyles: {},
        css: (properties) => /*css*/`
            :host {
                display: inline-block;
                box-sizing: content-box;
            }
            
            canvas {
                display: block;
            }

            img {
                width: fit-content;
            }
        `
    },

    renderTemplate: (properties) => {
        // canvas
        const canvas = /*html*/`
            <canvas
                styles="host"
                data-attr-data.prop.dark.color="@expr[properties.foreground]@end"
                data-attr-data.prop.light.color="@expr[properties.background]@end"
                data-attr-data.prop.width="@expr[properties.size]@end"
                data-attr-data.prop.margin="@expr[properties.margin]@end"
                data-attr-alt="@expr[properties.value}]@end"
                data-qrcode="@expr[properties.value]@end"
            ></canvas>
        `;
        // img
        const img = /*html*/`
            <img
                styles="host"
                data-attr-data.prop.dark.color="@expr[properties.foreground]@end"
                data-attr-data.prop.light.color="@expr[properties.background]@end"
                data-attr-data.prop.width="@expr[properties.size]@end"
                data-attr-data.prop.margin="@expr[properties.margin]@end"
                data-attr-alt="@expr[properties.value}]@end"
                data-qrcode="@expr[properties.value]@end"
            />
        `
        return img
    }
}

const fixedTable: ComponentDefinition = {
    type: 'fixed-table',
    name: 'Invoice Table',
    category: 'Layout',
    icon: '📋',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true,
        isContainer: false,
    },

    properties: [
        {
            name: 'style',
            type: 'select',
            defaultValue: 'default',
            options: [
                'default',
                'bordered',
                'dark',
                'newspaper',
                'striped',
                'condensed'
            ],
        },
        {
            name: 'entries',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        { name: 'item', type: 'text', defaultValue: 'Service', required: true },
                        { name: 'qty', type: 'number', defaultValue: 1 },
                        { name: 'price', type: 'number', defaultValue: 100 },
                        // { name: 'total', type: 'number', defaultValue: 100 }
                    ]
                }
            },
            defaultValue: [],
            description: 'Invoice table rows'
        },
        {
            name: 'chargesSummary',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'title',
                            type: "text",
                            defaultValue: 'Shipping'
                        },
                        {
                            name: 'value',
                            type: 'number',
                            defaultValue: 200
                        },
                        {
                            name: 'applyAs',
                            type: 'select',
                            options: [
                                'flat',
                                'percentage'
                            ],
                            defaultValue: 'flat'
                        }
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    title: 'shipping',
                    value: 500,
                    applyAs: 'flat'
                }
            ]
        },
        {
            name: 'currency',
            type: 'currency',
            defaultValue: ''
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'spacing-editor',
            'layout-editor',
            'background-editor',
            'typography-editor',
            'stack-editor'
        ],
        defaultStyles: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        css: (properties) => /*css*/`
            ${tableStylesCss}
        `
    },

    subElements: [
        {
            key: 'table',
            selector: 'table',
            name: 'Table',
        },
        {
            key: 'thead',
            selector: 'thead',
            name: 'Table Header',
        },
        {
            key: 'column',
            selector: 'th',
            name: 'Header Column',
        },
        {
            key: 'body',
            selector: 'tbody',
            name: 'Table Body',
        },
        {
            key: 'row',
            selector: 'tr',
            name: 'Table Row',
        },
    ],

    renderTemplate: () => {
        const emptyHtml = /*html*/`
            <div class="p-4 text-center">
                <p class="text-gray-500 font-space-mono font-semibold">No entries available.</p>
            </div>
        `;

        return /*html*/`
            <div styles="host" data-attr="class" attr-class="@expr[properties.style]@end">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr data-each="@expr[properties.entries]@end" data-key="entry">
                            <td data-text="@expr[entry.item]@end"></td>
                            <td data-text="@expr[entry.qty]@end"></td>
                            <td data-text="@expr[fmtCurrency(entry.price, properties.currency)]@end"></td>
                            <td data-text="@expr[fmtCurrency(Number(entry.qty) * Number(entry.price), properties.currency)]@end"></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="charges subtotal">
                            <td></td>
                            <td></td>
                            <td>SubTotal:</td>
                            <td data-text="@expr[fmtCurrency(properties.entries.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0), properties.currency )]@end"></td>
                        </tr>
                        <tr data-each="@expr[properties.chargesSummary]@end" data-key="charge" class="charges">
                            <td></td>
                            <td></td>
                            <td data-html="@expr[charge.title + (charge.applyAs == 'percentage' ? (' <b>(' + charge.value + '%)</b>') : '')]@end"></td>
                            <td data-text="@expr[
                                charge.applyAs == 'flat' ? fmtCurrency(charge.value, properties.currency) : charge.applyAs == 'percentage' ? fmtCurrency(properties.entries.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) * (charge.value / 100), properties.currency) : '']@end"></td>
                        </tr>
                        <tr footer>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td data-text="@expr[
                            fmtCurrency(
    properties.entries.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) +
    properties.chargesSummary.reduce((sum, item) => {
        const subtotal = properties.entries.reduce((s, i) => s + (Number(i.price) * Number(i.qty)), 0);
        return sum + (item.applyAs === 'flat' ? Number(item.value) : subtotal * (Number(item.value) / 100));
    }, 0)
    , properties.currency)

                                ]@end"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
        `;
    }
};


const dynamicTable: ComponentDefinition = {
    type: 'dynamic-table',
    name: 'Dynamic Table',
    category: 'Layout',
    icon: '🧮',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true,
        isContainer: false,
    },

    properties: [
        {
            name: 'column',
            type: {
                type: 'array',
                itemType: 'text'
            },
            defaultValue: [
                {
                    id: nanoid(),
                    value: 'Item'
                },
                {
                    id: nanoid(),
                    value: 'Qty'
                },
                {
                    id: nanoid(),
                    value: 'Price'
                },
                {
                    id: nanoid(),
                    value: 'Total'
                }
            ],
            description: 'Column headers'
        },
        {
            name: 'entries',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'row',
                            type: {
                                type: 'array',
                                itemType: 'text'
                            },
                            defaultValue: []
                        }
                    ]
                }
            },
            defaultValue: [
                {
                    id: '01',
                    row: [
                        "Stationery",
                        "2",
                        "150",
                        "300"
                    ]
                }
            ],
            description: 'Table row values (must match column count)'
        }
    ],

    subElements: [
        {
            key: 'table',
            selector: 'table',
            name: 'Table',
        },
        {
            key: 'thead',
            selector: 'thead',
            name: 'Table Header',
        },
        {
            key: 'column',
            selector: 'th',
            name: 'Header Column',
        },
        {
            key: 'body',
            selector: 'tbody',
            name: 'Table Body',
        },
        {
            key: 'row',
            selector: 'tr',
            name: 'Table Row',
        },
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'spacing-editor',
            'layout-editor',
            'typography-editor',
            'background-editor',
            // 'stack-editor'
        ],
        defaultStyles: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        css: () => /*css*/`
            table {
                border-collapse: collapse;
                width: 100%;
            }

            table, th, td {
                border: 1px solid black;
            }

            td {
                padding: 0px 8px;
                text-align: left;
            }
        `
    },

    renderTemplate: ({ columns, rows }) => {
        const header = /*html*/`
            <thead>
                <tr>
                    <th
                        data-each="@expr[properties.column]@end"
                        data-key="column"
                    > <span data-text="@expr[column?.value]@end"></span> </th>
                </tr>
            </thead>
        `;

        const body = /*html*/`
            <tbody>
                <tr data-each="@expr[properties.entries]@end" data-key="entry">
                    <td data-each="@expr[entry.row]@end" data-key="cell">
                        <span data-text="@expr[cell?.value || cell]@end"></span>
                    </td>
                </tr>
            </tbody>
        `;

        return `<div styles="host"><table>${header}${body}</table></div>`;
    }
};

// 2 Column Grid
const columnGrid: ComponentDefinition = {
    type: 'column-grid',
    name: 'Column Grid',
    category: 'Layout',
    icon: '🖼️',

    capabilities: {
        canHaveChildren: false,
        canAcceptStyles: true,
        canBeDeleted: true,
        isContainer: false,
        enableHandle: true
    },

    properties: [
        {
            name: 'direction',
            type: 'select',
            options: [
                'column',
                'row'
            ],
            defaultValue: 'row'
        },

        {
            name: 'gap',
            type: 'number',
            defaultValue: 10
        },

        {
            name: 'justify',
            type: 'select',
            options: [
                'start',
                'center',
                'end',
                'space-between',
                'space-around'
            ],
            defaultValue: 'start'
        },

        {
            name: 'alignment',
            type: 'select',
            options: [
                'stretch',
                'start',
                'center',
                'end'
            ],
            defaultValue: 'stretch'
        },
        {
            name: 'flex',
            type: 'boolean',
            defaultValue: true
        }
    ],

    subElements: [
        {
            key: 'columna',
            selector: '[dropzone-column-1]',
            name: 'Column 1',
            capabilities: {
                isContainer: true,
                canBeDeleted: true,
                canHaveChildren: true
            }
        },
        {
            key: 'columnb',
            selector: '[dropzone-column-2]',
            name: 'Column 2',
            capabilities: {
                isContainer: true,
                canBeDeleted: true,
                canHaveChildren: true
            }
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'spacing-editor',
            'background-editor',
            'layout-editor',
        ],
        css(properties) {
            return /*css*/`
                [styles=host] {
                    display: flex;
                    flex-direction: ${properties.direction};
                    justify-content: ${properties.justify};
                    align-items: ${properties.alignment};
                    gap: ${properties.gap}px;
                    /* padding: 10px */
                }

                [dropzone-column-1], [dropzone-column-2] {
                    flex: ${properties.flex ? '1' : 'initial'};
                }

                [dropzone]:not(:has(editor-component)):has(slot) {
                    /* background-color: #f4f4f5;
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center; */
                    /* padding: 10px; */
                }
            `
        },
    },

    renderTemplate: (properties) => {
        return /*html*/`
            <div
                styles="host"
            >
                <div dropzone-column-1><slot name="columna"></slot></div>
                <div dropzone-column-2><slot name="columnb"></slot></div>
            </div>
        `
    }
}

const socialLinks: ComponentDefinition = {
    type: 'social-links',
    name: 'Social Links',
    category: 'Layout',
    icon: '🔗',

    capabilities: {},
    properties: [
        {
            name: 'links',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        { name: 'title', type: 'text', defaultValue: '' },
                        { name: 'url', type: 'text', defaultValue: '' },
                        { name: 'icon', type: 'image', defaultValue: '' }
                    ]
                }
            },
            defaultValue: [
                {
                    id: nanoid(),
                    title: 'Facebook',
                    url: 'https://www.facebook.com',
                    icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAd1JREFUaEPtlzFLw0AYht8vBUVcHErBVQf9C6YqddFBcHFpREGESkQHce1S0L+gTVwEh2YoOOkqSo3FrT+gP0DpKNQK9U4KZmt7d21NGriuea95n7v3+74L4R9/K7vuLPthWwBtEGiRgSUJSAJEvV7re3bPZ93WKIllWdf3bqc/2828AZwCmJJd19FFDpDZv5lpf7ceOMhUMR5oIwbgtGS5jwaQGcR85CdgZos5Iroe1HzEAJzMrFsnwlwsAcwdZ5U4nocxH+kJLFvuBQfPxxjAuefAZmwB0laxDtC8EIChhgTO2zzhv3m5D6FeIBjZIDOzxQYRJfu+j6HGWNOsls++hjUerB8dgOW0CJjsa4yw7Zfsu1GZ7/zPyADSlsNFxoz2RKpSPmiIdCrPQwXwF94TKBSYikGRNlwAxZumyHzoEVK9qGkAmR0INDJFHNkJyJhTgRVpCTh+8ewrkU66BsIGMGBkKt6h1MVQqguFDqAwL8YOgIM3Xr2jlEx8xjJCDHiqevZabAFAuPRL9klsAVQ60FhGSKUDjSeAQgeSBpDJo0yrjWwSa4C/HdAn0CUKUpNYR0hHqHcGdIRi8UWmi1gXsS5icRXoy5x4j7oq9BzQc2DA6ATLdIR0hIaM0C8+SfExumgVJwAAAABJRU5ErkJggg==`
                },
                {
                    id: nanoid(),
                    title: 'Instagram',
                    url: 'https://www.instagram.com',
                    icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDU1MS4wMzQgNTUxLjAzNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8ZyBpZD0iWE1MSURfMTNfIj4NCgkNCgkJPGxpbmVhckdyYWRpZW50IGlkPSJYTUxJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyNzUuNTE3IiB5MT0iNC41NzE0IiB4Mj0iMjc1LjUxNyIgeTI9IjU0OS43MjAyIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTU0KSI+DQoJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNFMDlCM0QiLz4NCgkJPHN0b3AgIG9mZnNldD0iMC4zIiBzdHlsZT0ic3RvcC1jb2xvcjojQzc0QzREIi8+DQoJCTxzdG9wICBvZmZzZXQ9IjAuNiIgc3R5bGU9InN0b3AtY29sb3I6I0MyMTk3NSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojNzAyNEM0Ii8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8cGF0aCBpZD0iWE1MSURfMTdfIiBzdHlsZT0iZmlsbDp1cmwoI1hNTElEXzJfKTsiIGQ9Ik0zODYuODc4LDBIMTY0LjE1NkM3My42NCwwLDAsNzMuNjQsMCwxNjQuMTU2djIyMi43MjINCgkJYzAsOTAuNTE2LDczLjY0LDE2NC4xNTYsMTY0LjE1NiwxNjQuMTU2aDIyMi43MjJjOTAuNTE2LDAsMTY0LjE1Ni03My42NCwxNjQuMTU2LTE2NC4xNTZWMTY0LjE1Ng0KCQlDNTUxLjAzMyw3My42NCw0NzcuMzkzLDAsMzg2Ljg3OCwweiBNNDk1LjYsMzg2Ljg3OGMwLDYwLjA0NS00OC42NzcsMTA4LjcyMi0xMDguNzIyLDEwOC43MjJIMTY0LjE1Ng0KCQljLTYwLjA0NSwwLTEwOC43MjItNDguNjc3LTEwOC43MjItMTA4LjcyMlYxNjQuMTU2YzAtNjAuMDQ2LDQ4LjY3Ny0xMDguNzIyLDEwOC43MjItMTA4LjcyMmgyMjIuNzIyDQoJCWM2MC4wNDUsMCwxMDguNzIyLDQ4LjY3NiwxMDguNzIyLDEwOC43MjJMNDk1LjYsMzg2Ljg3OEw0OTUuNiwzODYuODc4eiIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlhNTElEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjI3NS41MTciIHkxPSI0LjU3MTQiIHgyPSIyNzUuNTE3IiB5Mj0iNTQ5LjcyMDIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1NTQpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0UwOUIzRCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIwLjMiIHN0eWxlPSJzdG9wLWNvbG9yOiNDNzRDNEQiLz4NCgkJPHN0b3AgIG9mZnNldD0iMC42IiBzdHlsZT0ic3RvcC1jb2xvcjojQzIxOTc1Ii8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM3MDI0QzQiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxwYXRoIGlkPSJYTUxJRF84MV8iIHN0eWxlPSJmaWxsOnVybCgjWE1MSURfM18pOyIgZD0iTTI3NS41MTcsMTMzQzE5Ni45MzMsMTMzLDEzMywxOTYuOTMzLDEzMywyNzUuNTE2DQoJCXM2My45MzMsMTQyLjUxNywxNDIuNTE3LDE0Mi41MTdTNDE4LjAzNCwzNTQuMSw0MTguMDM0LDI3NS41MTZTMzU0LjEwMSwxMzMsMjc1LjUxNywxMzN6IE0yNzUuNTE3LDM2Mi42DQoJCWMtNDguMDk1LDAtODcuMDgzLTM4Ljk4OC04Ny4wODMtODcuMDgzczM4Ljk4OS04Ny4wODMsODcuMDgzLTg3LjA4M2M0OC4wOTUsMCw4Ny4wODMsMzguOTg4LDg3LjA4Myw4Ny4wODMNCgkJQzM2Mi42LDMyMy42MTEsMzIzLjYxMSwzNjIuNiwyNzUuNTE3LDM2Mi42eiIvPg0KCQ0KCQk8bGluZWFyR3JhZGllbnQgaWQ9IlhNTElEXzRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjQxOC4zMDYiIHkxPSI0LjU3MTQiIHgyPSI0MTguMzA2IiB5Mj0iNTQ5LjcyMDIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1NTQpIj4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0UwOUIzRCIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIwLjMiIHN0eWxlPSJzdG9wLWNvbG9yOiNDNzRDNEQiLz4NCgkJPHN0b3AgIG9mZnNldD0iMC42IiBzdHlsZT0ic3RvcC1jb2xvcjojQzIxOTc1Ii8+DQoJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM3MDI0QzQiLz4NCgk8L2xpbmVhckdyYWRpZW50Pg0KCTxjaXJjbGUgaWQ9IlhNTElEXzgzXyIgc3R5bGU9ImZpbGw6dXJsKCNYTUxJRF80Xyk7IiBjeD0iNDE4LjMwNiIgY3k9IjEzNC4wNzIiIHI9IjM0LjE0OSIvPg0KPC9nPg0KPC9zdmc+`
                },
                {
                    id: nanoid(),
                    title: 'LinkedIn',
                    url: 'https://www.linkedin.com',
                    icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDM4MiAzODIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzAwNzdCNzsiIGQ9Ik0zNDcuNDQ1LDBIMzQuNTU1QzE1LjQ3MSwwLDAsMTUuNDcxLDAsMzQuNTU1djMxMi44ODlDMCwzNjYuNTI5LDE1LjQ3MSwzODIsMzQuNTU1LDM4MmgzMTIuODg5DQoJQzM2Ni41MjksMzgyLDM4MiwzNjYuNTI5LDM4MiwzNDcuNDQ0VjM0LjU1NUMzODIsMTUuNDcxLDM2Ni41MjksMCwzNDcuNDQ1LDB6IE0xMTguMjA3LDMyOS44NDRjMCw1LjU1NC00LjUwMiwxMC4wNTYtMTAuMDU2LDEwLjA1Ng0KCUg2NS4zNDVjLTUuNTU0LDAtMTAuMDU2LTQuNTAyLTEwLjA1Ni0xMC4wNTZWMTUwLjQwM2MwLTUuNTU0LDQuNTAyLTEwLjA1NiwxMC4wNTYtMTAuMDU2aDQyLjgwNg0KCWM1LjU1NCwwLDEwLjA1Niw0LjUwMiwxMC4wNTYsMTAuMDU2VjMyOS44NDR6IE04Ni43NDgsMTIzLjQzMmMtMjIuNDU5LDAtNDAuNjY2LTE4LjIwNy00MC42NjYtNDAuNjY2UzY0LjI4OSw0Mi4xLDg2Ljc0OCw0Mi4xDQoJczQwLjY2NiwxOC4yMDcsNDAuNjY2LDQwLjY2NlMxMDkuMjA4LDEyMy40MzIsODYuNzQ4LDEyMy40MzJ6IE0zNDEuOTEsMzMwLjY1NGMwLDUuMTA2LTQuMTQsOS4yNDYtOS4yNDYsOS4yNDZIMjg2LjczDQoJYy01LjEwNiwwLTkuMjQ2LTQuMTQtOS4yNDYtOS4yNDZ2LTg0LjE2OGMwLTEyLjU1NiwzLjY4My01NS4wMjEtMzIuODEzLTU1LjAyMWMtMjguMzA5LDAtMzQuMDUxLDI5LjA2Ni0zNS4yMDQsNDIuMTF2OTcuMDc5DQoJYzAsNS4xMDYtNC4xMzksOS4yNDYtOS4yNDYsOS4yNDZoLTQ0LjQyNmMtNS4xMDYsMC05LjI0Ni00LjE0LTkuMjQ2LTkuMjQ2VjE0OS41OTNjMC01LjEwNiw0LjE0LTkuMjQ2LDkuMjQ2LTkuMjQ2aDQ0LjQyNg0KCWM1LjEwNiwwLDkuMjQ2LDQuMTQsOS4yNDYsOS4yNDZ2MTUuNjU1YzEwLjQ5Ny0xNS43NTMsMjYuMDk3LTI3LjkxMiw1OS4zMTItMjcuOTEyYzczLjU1MiwwLDczLjEzMSw2OC43MTYsNzMuMTMxLDEwNi40NzINCglMMzQxLjkxLDMzMC42NTRMMzQxLjkxLDMzMC42NTR6Ii8+DQo8L3N2Zz4=`
                },
                {
                    id: nanoid(),
                    title: 'X (formerly Twitter)',
                    url: 'https://www.twitter.com',
                    icon: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PCFET0NUWVBFIHN2ZyAgUFVCTElDICctLy9XM0MvL0RURCBTVkcgMS4xLy9FTicgICdodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGhlaWdodD0iMjRweCIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGc+PHBhdGggZD0iTTIyLjgsMjMuNUgxN2MtMC4yLDAtMC4zLTAuMS0wLjQtMC4yTDEyLDE1LjNsLTQuNiw3LjljLTAuMSwwLjItMC4yLDAuMi0wLjQsMC4ySDEuMmMtMC4yLDAtMC4zLTAuMS0wLjQtMC4yICAgYy0wLjEtMC4xLTAuMS0wLjMsMC0wLjVjMC0wLjEsMC4xLTAuMiwwLjEtMC4yTDYuOSwxMkwwLjgsMS40YzAtMC4xLTAuMS0wLjEtMC4xLTAuMmMtMC4xLTAuMi0wLjEtMC40LDAtMC41ICAgQzAuOCwwLjYsMSwwLjUsMS4yLDAuNUg3YzAuMiwwLDAuMywwLjEsMC40LDAuMkwxMiw4LjdsNC42LTcuOWMwLjEtMC4yLDAuMi0wLjIsMC40LTAuMmg1LjljMC4yLDAsMC4zLDAuMSwwLjQsMC4yICAgYzAuMSwwLjEsMC4xLDAuMywwLDAuNWMwLDAuMS0wLjEsMC4yLTAuMSwwLjJMMTcuMSwxMmw2LjEsMTAuNmMwLDAuMSwwLjEsMC4xLDAuMSwwLjJjMC4xLDAuMiwwLjEsMC40LDAsMC41ICAgQzIzLjIsMjMuNCwyMywyMy41LDIyLjgsMjMuNXoiLz48L2c+PC9zdmc+`
                },
            ]
        },
        {
            name: 'direction',
            type: 'select',
            options: [
                'row',
                'column'
            ],
            defaultValue: 'row'
        },
        {
            name: 'columnGap',
            type: 'number',
            defaultValue: 10
        },
        {
            name: 'rowGap',
            type: 'number',
            defaultValue: 10
        },
        {
            name: 'iconSize',
            type: 'number',
            defaultValue: 25
        },
        {
            name: 'showLabel',
            type: 'boolean',
            defaultValue: false
        }
    ],

    subElements: [
        {
            key: 'icon',
            selector: 'a.social-link > img',
            name: 'Icons',
            capabilities: {}
        }
    ],

    styleSettings: {
        allowedProperties: [
            // 'dimension-editor',
            'typography-editor',
            'spacing-editor',
            // 'layout-editor',
            // 'background-editor'
        ],
        css(properties) {
            return /*css*/`
                [styles=host] {
                    display: ${properties.direction == 'row' ? 'flex' : 'grid'};
                    flex-direction: row;
                    column-gap: ${properties.columnGap}px;
                    row-gap: ${properties.rowGap}px;
                    flex-wrap: wrap
                }

                a.social-link {
                    display: flex;
                    gap: 5px;
                    align-items: center;

                    img {
                        width: ${properties.iconSize}px;
                        height: ${properties.iconSize}px;
                        object-fit: contain;
                    }

                    span {
                        display: ${properties.showLabel ? 'block' : 'none'};
                        font-size: 100%;
                        font-weight: 600
                    }
                }

                :host a {
                    pointer-events: none
                }
            `
        },
    },

    renderTemplate: (properties) => {
        // single link
        const link = /*html*/`
            <a class="social-link" data-attr="href" attr-href="@expr[link.url]@end" target="_blank">
                <img data-attr="src" attr-src="@expr[link.icon]@end" />
                <span data-text="@expr[link.title]@end"></span>
            </a>
        `

        return /*html*/`
            <ul styles="host">
                <li data-each="@expr[properties.links]@end" data-key="link">
                    ${link}
                </li>
            </ul>
        `
    }
}

const signature_base64 =
`data:image/png;base64,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`

const signature: ComponentDefinition = {
    type: 'signature',
    name: 'Signature',
    category: 'Layout',

    capabilities: {},
    properties: [
        {
            name: 'capture',
            type: 'image',
            defaultValue: signature_base64,
            description: 'Upload your signature here',
        },
        {
            name: 'size',
            type: 'number',
            defaultValue: 100
        },
        {
            name: 'useCapture',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'type',
            type: 'text',
            description: 'Enter your signature type here',
            defaultValue: 'Evelyn Smith'
        },
        {
            name: 'color',
            type: 'color',
            defaultValue: '#000000',
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'layout-editor',
            'spacing-editor'
        ],
        css(properties) {
            return /*css*/`
                [styles=host] {
                    p {
                        font-family: 'Priestacy', sans-serif;
                        font-size: 15pt;
                        color: ${properties.color};
                        display: ${properties.useCapture ? 'none' : 'block'}
                    }

                    img {
                        width: ${properties.size}px;
                        height: auto;
                        object-fit: contain;
                        display: ${properties.useCapture ? 'block' : 'none'}
                    }
                }
            `
        },
    },

    subElements: [
        {
            // signature text
            key: 'signaturetext',
            selector: 'p',
            name: 'Signature Text'
        }
    ],

    renderTemplate: (properties) => {
        return /*html*/`
            <div styles="host">
                <img data-attr="src" attr-src="@expr[properties.capture]@end" />
                <p data-text="@expr[properties.type]@end"></p>
            </div>
        `
    }
}

// RECIPIENT
const recipient: ComponentDefinition = {
    type: 'recipient',
    name: 'Recipient',
    category: 'Layout',

    capabilities: {},
    properties: [
        {
            name: 'nameOfRecipient',
            type: 'text',
            defaultValue: 'Evelyn Smith'
        },
        {
            name: 'title',
            type: 'text',
            defaultValue: 'Head of Operations'
        },
        {
            name: 'company',
            type: 'text',
            defaultValue: 'Studio AB1'
        },
        {
            name: 'email',
            type: 'text',
            defaultValue: 'evelyn@studioab1.com'
        },
        {
            name: 'phone',
            type: 'tel',
            defaultValue: '(213) 333-9277'
        },
        {
            name:'hideLabel',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'columnGap',
            type: 'number',
            defaultValue: 20
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'background-editor',
            'spacing-editor'
        ],
        css(properties) {
            return /*css*/`
                ul {
                    font-family: "Space Mono";
                    font-weight: 500;
                    font-size: 14px;
                }

                ul#labels li {
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #131313ff;
                }

                ul#labels {
                    display: ${properties.hideLabel ? 'none' : 'block' };
                }

                [styles=host] {
                    display: ${properties.hideLabel ? 'block' : 'inline-flex'};
                    grid-template-columns: auto 1fr;
                    column-gap: ${properties.columnGap}px;
                }
            `
        }
    },

    renderTemplate: (properties) => {
        return /*html*/`
            <div styles="host">
                <ul id="labels">
                    <li>client</li>
                    <li>company</li>
                    <li>email</li>
                    <li>phone</li>
                </ul>
                <ul id="info">
                    <li>${properties.nameOfRecipient}</li>
                    <li>${properties.company}</li>
                    <li>${properties.email}</li>
                    <li>${properties.phone}</li>
                </ul>
            </div>
        `
    }
}

// MONEY COMPONENT
const money: ComponentDefinition = {
    type: 'money',
    name: 'Money',
    category: 'Layout',

    capabilities: {},

    properties: [
        {
            name: 'amount',
            type: "currency-format",
            defaultValue: {
                value: 500
            }
        }
    ],

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'spacing-editor'
        ],
        defaultStyles: {
        },
        css: (properties) => /*css*/`
            :host, p {
                display: block;
                font-family: 'Urbanist';
            }

            p {
                white-space: pre-wrap;
                line-height: 1.5,
                color: #333333;
                font-size: 10pt;
            }
        `
    },

    renderTemplate: (properties) => `<p styles="host">${properties.amount?.formatted || properties.amount?.value}</p>`
}

const spacer: ComponentDefinition = {
    type: 'spacer',
    name: 'Spacer',
    category: 'Layout',

    capabilities: {},

    styleSettings: {
        allowedProperties: [
            'dimension-editor'
        ],
        defaultStyles: {
            'height': '100px'
        },
        css: (properties) => /*css*/``
    },
    
    properties: [],
    renderTemplate: (properties) => `<div styles="host"></div>`
}

const card: ComponentDefinition = {
    type: 'card',
    name: 'Card',
    category: 'Containers',
    icon: '🃏',

    // Global capabilities
    capabilities: {
        canHaveChildren: false,
        // childrenLocked: true,
        canBeDeleted: false,
        canAcceptStyles: true,
        isContainer: true
    },

    styleSettings: {
        allowedProperties: [
            'dimension-editor',
            'typography-editor',
            'layout-editor',
            'spacing-editor',
            'background-editor',
            'stack-editor'
        ],
        defaultStyles: {
            'background-color': '#ffffff',
            'border-radius': '8px',
            // 'box-shadow': '0 2px 8px rgba(0,0,0,0.1)',
            'width': '100%'
        },
        css: (properties) => /*css*/`
             :host {
                background-color: #fff;
                border-radius: 8px;
                /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
                max-width: 400px;
                margin: 0 auto;
                overflow: hidden;
                border: 1px solid #ddd;
            }

            .card-header {
                padding: 16px;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ccc;
            }

            .card-header h3 {
                margin: 0 0 8px;
                font-size: 1.2em;
            }

            .card-header p {
                margin: 0;
                color: #666;
                font-size: 0.95em;
            }

            .card-body {
                padding: 16px;
                min-height: 100px;
                background-color: #fafafa;
                outline: none;
                transition: background 0.2s;
            }

            .card-footer {
                padding: 12px 16px;
                background-color: #f9f9f9;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
        `
    },

    properties: [
        {
            name: 'title',
            type: 'text',
            defaultValue: 'Card Title',
            group: 'Header',
            helptext: 'The title of the card.',
            description: "Enter in clear words the 'title' of this card."
        },
        {
            name: 'description',
            type: 'rich-text',
            defaultValue: '-',
            group: 'Header'
        },
        {
            name: 'hideDescription',
            type: 'boolean',
            defaultValue: 'true',
            group: 'Header'
        },
        {
            name: 'showFooter',
            type: 'boolean',
            defaultValue: true,
            group: 'Footer'
        },
        {
            name: 'users',
            type: {
                type: 'array',
                itemType: {
                    type: 'object',
                    shape: [
                        {
                            name: 'name',
                            type: 'text',
                            defaultValue: 'John Doe'
                        },
                        {
                            name: 'age',
                            type: 'number',
                            defaultValue: 30
                        },
                        {
                            name: 'profilePicture',
                            type: 'image',
                            defaultValue: ''
                        },
                        {
                            name: "friends",
                            type: {
                                type: 'array',
                                itemType: {
                                    type: 'object',
                                    shape: [
                                        {
                                            name: 'name',
                                            type: 'text',
                                            defaultValue: 'Jane Doe'
                                        },
                                        {
                                            name: 'age',
                                            type: 'number',
                                            defaultValue: 28
                                        },
                                        {
                                            name: 'hobbies',
                                            singularLabel: 'hobby',
                                            type: {
                                                type: 'array',
                                                itemType: "text"
                                            },
                                            group: 'Data',
                                            description: 'List of hobbies for the user.',
                                            defaultValue: []
                                        },
                                    ]
                                }
                            },
                            defaultValue: []
                        },
                        {
                            name: 'family',
                            type: {
                                type: 'object',
                                shape: [
                                    {
                                        name: 'father',
                                        type: 'text',
                                        defaultValue: 'John Sr.'
                                    },
                                    {
                                        name: 'mother',
                                        type: 'text',
                                        defaultValue: 'Jane Sr.'
                                    }
                                ]
                            },
                            defaultValue: {
                                father: 'John Sr.',
                                mother: 'Jane Sr.'
                            }
                        }
                    ]
                }
            },
            group: 'Data',
            description: 'List of users to display in the card.',
            defaultValue: []
        },
        {
            name: 'hobbies',
            type: {
                type: 'array',
                itemType: "text"
            },
            group: 'Data',
            description: 'List of hobbies for the user.',
            defaultValue: []
        },
        {
            name: 'client',
            type: {
                type: "object",
                shape: [
                    {
                        name: "name",
                        type: "text",
                        defaultValue: "John"
                    },
                    {
                        name: "email",
                        type: "text",
                        defaultValue: "john@email.com"
                    },
                    {
                        name: "phone",
                        type: "tel",
                        defaultValue: ""
                    },
                    {
                        name: "active",
                        type: "boolean",
                        defaultValue: false
                    }
                ]
            },
            defaultValue: {}
        }
    ],

    subElements: [
        {
            key: 'header',
            selector: '.card-header',
            name: 'Header',
            allowedStyles: ['padding', 'background-color', 'border-bottom'],
            capabilities: {
                canAcceptStyles: true,
                canHaveChildren: false
            }
        },
        {
            key: 'body',
            selector: '.card-body',
            name: 'Body',
            allowedStyles: ['padding', 'min-height'],
            capabilities: {
                canHaveChildren: 5,
                canAcceptStyles: true,
                isContainer: true,
                canBeDeleted: true
            }
        },
        {
            key: 'footer',
            selector: '.card-footer',
            name: 'Footer',
            allowedStyles: ['padding', 'background-color', 'border-top'],
            capabilities: {
                canAcceptStyles: true,
                isContainer: true
            }
        }
    ],

    defaultChildren: [
        {
            name: 'Save Button',
            type: 'button',
            properties: [
                {
                    name: 'variant',
                    type: 'select',
                    defaultValue: 'clear',
                },
                {
                    name: 'label',
                    type: 'text',
                    defaultValue: 'Save'
                }
            ],
            styleSettings: {
                defaultStyles: {
                    'background-color': '#791e07ff',
                    'color': '#fff'
                }
            },
            selector: '.card-footer',
        },
        {
            name: 'Cancel Button',
            type: 'button',
            properties: [
                {
                    name: 'variant',
                    type: 'select',
                    defaultValue: 'secondary',
                },
                {
                    name: 'label',
                    type: 'text',
                    defaultValue: 'Cancel'
                }
            ],
            selector: '.card-footer'
        }
    ],

    renderTemplate: (properties) => {
        return /*HTML*/`
            <div class="card-header">
                <h3>
                    <b data-text="@expr[properties.client?.name]@end"></b>
                    <span data-text="@expr[properties.title]@end"></span>
                </h3>
                <p data-if="@expr[!properties.hideDescription]@end" data-text="@expr[properties.description]@end"></p>
            </div>

            <div id="client">
                <h3>Client</h3>
                <h4 data-text="@expr[properties.client?.name]@end"></h4>
                <p data-text="@expr[properties.client?.email]@end"></p>
                <p data-text="@expr[properties.client?.phone]@end"></p>
                <p data-text="@expr[properties.client?.active ? 'Active' : 'Inactive']@end"></p></h4>
            </div>
            
            <ul id="userList">
                <!--
                    data-each tells the engine “for each element in users”,
                    data-key names each loop variable “user”,
                    and @expr[user.*]@end is evaluated for each object.
                -->
                <li data-each="@expr[properties.users]@end" data-key="user">
                    <span data-text="@expr[user.name]@end"></span>
                    – <span data-text="@expr[user.age]@end years old"></span>
                    <img data-ifo="@expr[user.profilePicture]@end" data-bind data-attr-src="@expr[user.profilePicture]@end" data-bind data-attr-alt="@expr[user.name]@end's profile picture" />
                    <ul style="list-style-type: disc; margin-left: 20px;">
                        <li data-each="@expr[user.friends]@end" data-key="friend">
                            <span data-text="@expr[friend.name]@end"></span>
                            – <span data-text="@expr[friend.age]@end years old"></span>
                            <ul>
                                <li data-each="@expr[friend.hobbies]@end" data-key="hobby">
                                    <span data-text="@expr[hobby]@end"></span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div data-if="@expr[user.family]@end" class="family">
                        <span>Family:</span>
                        <h3 data-text="@expr[user.family?.father]@end"></h3>
                        <h3 data-text="@expr[user.family?.mother]@end"></h3>
                    </div>
                </li>
            </ul>

            <!-- hobbies -->
            <ul>
                <li data-each="@expr[properties.hobbies]@end" data-key="hobby">
                    <span data-text="@expr[hobby?.value]@end"></span>
                </li>
            </ul>

            <div class="card-body" tabindex="0"></div>
            <div data-if="@expr[properties.showFooter]@end" class="card-footer" tabindex="0"></div>
        `
    }
};

export default {
  button,
  dropzone,
  heading,
  paragraph,
  telephone,
  divider,
  image,
  qrcode,
  dynamicTable,
  fixedTable,
  columnGrid,
  socialLinks,
  signature,
  recipient,
  money,
  spacer,


  card
};