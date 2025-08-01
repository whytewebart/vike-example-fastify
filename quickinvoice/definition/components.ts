import { nanoid } from "nanoid";

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
            'background-color',
            'color',
            'padding',
            'border-radius'
        ],
        defaultStyles: {
            'padding': '8px 16px',
            'border-radius': '4px',
            // 'background-color': '#007bff',
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
        isContainer: true
    },

    styleSettings: {
        allowedProperties: [
            'background-color',
            'border',
            'padding',
            'min-height'
        ],
        defaultStyles: {
            'padding': '10px'
        },
        css: (properties) => /*css*/`
            [dropzone]:not(:has(editor-component)):has(slot) {
                min-height: 60px;
                /* border: 1px dashed rgba(0, 0, 0, 0.08); */
            }

            [dropzone]:not(:has(editor-component)):has(slot)::before {
                content: "Drop content here";
                color: rgba(0, 0, 0, 0.3);
                font-size: 0.875rem;
                font-style: italic;
            }
        `
    },

    properties: [],
    subElements: [],
    defaultChildren: [],
    renderTemplate: (properties) => /*html*/`
        <div styles="host" dropzone><slot></slot></div>
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
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        },
        {
            name: 'text',
            type: 'text',
            defaultValue: 'Heading Text'
        }
    ],

    styleSettings: {
        allowedProperties: [
            'font-size',
            'font-weight',
            'color',
            'text-align',
            'margin-top',
            'margin-bottom'
        ],
        defaultStyles: {},
        css: (properties) => /*css*/`
            :host, h1, h2, h3, h4, h5, h6 {
                display: block;
                font-family: 'Urbanist';
            }
            h1, [tag="h1"] { font-size: 32px; }
            h2, [tag="h2"] { font-size: 24px; }
            h3, [tag="h3"] { font-size: 16px; }
            h4, [tag="h4"] { font-size: 14px; }
            h5, [tag="h5"] { font-size: 12px; }
            h6, [tag="h6"] { font-size: 10px; }
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
            'font-size',
            'color',
            'text-align',
            'line-height',
            'margin-top',
            'margin-bottom'
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

    renderTemplate: (properties) => `<p styles="host">${properties.text}</p>`
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
            'padding-top',
            'padding-bottom',
            'width',
            'border-top-width',
            'border-top-color',
            'border-top-style'
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
            'width',
            'height',
            'border-radius',
            'box-shadow'
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
        allowedProperties: [],
        defaultStyles: {},
        css: (properties) => /*css*/`
            :host {
                display: inline-block;
                box-sizing: content-box;
            }
            
            canvas {
                display: block;
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
                data-attr-alt="@expr[properties.value}"]@end 
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
            type: 'text',
            defaultValue: '$'
        }
    ],

    styleSettings: {
        allowedProperties: ['padding', 'margin', 'border', 'background', 'font-size', 'color'],
        defaultStyles: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        css: () => /*css*/`
         table {
                border-collapse: collapse;
                width: 100%;
            }

            th, td {
                border: 1px solid black;
            }

            td {
                padding: 0px 8px;
                text-align: left;
            }

            tr[footer] {
                font-weight: 700
            }

            .charges > *:nth-child(1), .charges > *:nth-child(2) {
                border: none !important;
            }

            .charges > *:nth-child(3), .charges > *:nth-child(4) {
                background-color: #ecececff
            }
        `
    },

    subElements: [
        {
            key: 'thead',
            selector: 'thead',
            name: 'Table Header Columns',
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

    renderTemplate: ({ entries }) => {
        return /*html*/`
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
                        <td data-text="@expr[properties.currency + '' + entry.price]@end"></td>
                        <td data-text="@expr[properties.currency + '' + (Number(entry.qty) * Number(entry.price))]@end"></td>
                    </tr>
                    <tr data-each="@expr[properties.chargesSummary]@end" data-key="charge" class="charges">
                        <td></td>
                        <td></td>
                        <td data-text="@expr[charge.title]@end"></td>
                        <td data-text="@expr[(charge.applyAs == 'flat' ? properties.currency : '') + charge.value + (charge.applyAs == 'percentage' ? '%' : '')]@end"></td>
                    </tr>
                    <tr footer>
                        <td style="border: 0;"></td>
                        <td style="border: 0;"></td>
                        <td>SubTotal:</td>
                        <td data-text="@expr[
                        properties.currency + ' ' + (
  properties.entries.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0) +
  properties.chargesSummary.reduce((sum, item) => {
    const subtotal = properties.entries.reduce((s, i) => s + (Number(i.price) * Number(i.qty)), 0);
    return sum + (item.applyAs === 'flat' ? Number(item.value) : subtotal * (Number(item.value) / 100));
  }, 0)
)

                            ]@end"></td>
                    </tr>
                </tbody>
            </table>
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

    styleSettings: {
        allowedProperties: ['padding', 'margin', 'border', 'background', 'font-size', 'color'],
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

        return `<table>${header}${body}</table>`;
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
        isContainer: false
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
        css(properties) {
            return /*css*/`
                [styles=host] {
                    display: flex;
                    flex-direction: ${properties.direction};
                    justify-content: ${properties.justify};
                    align-items: ${properties.alignment};
                    gap: ${properties.gap}px;
                    margin: 10px
                }

                [dropzone-column-1], [dropzone-column-2] {
                    background-color: #f4f4f5;
                    flex: 1;
                    padding: 10px;
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


export default { button, dropzone, heading, paragraph, divider, image, qrcode, dynamicTable, fixedTable, columnGrid }