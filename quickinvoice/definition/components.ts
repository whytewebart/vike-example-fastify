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
        <div styles="host" dropzone><slot name="children"></slot></div>
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
            defaultValue: 'https://placehold.co/200'
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
        <figure styles="host">
            <img src="${properties.src}" alt="${properties.alt}" />
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
                data-attr-data.prop.dark.color="{properties.foreground}"
                data-attr-data.prop.light.color="{properties.background}"
                data-attr-data.prop.width="{properties.size}"
                data-attr-data.prop.margin="{properties.margin}"
                data-qrcode="{properties.value}"
            ></canvas>
        `;
        // img
        const img = /*html*/`
            <img
                styles="host"
                data-attr-data.prop.dark.color="{properties.foreground}"
                data-attr-data.prop.light.color="{properties.background}"
                data-attr-data.prop.width="{properties.size}"
                data-attr-data.prop.margin="{properties.margin}"
                data-attr-alt="{properties.value}"  
                data-qrcode="{properties.value}"
            />
        `
        return img
    }
}

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
                    // row: [
                    //     {
                    //         id: '11',
                    //         value: 'Design'
                    //     },
                    //     {
                    //         id: '22',
                    //         value: '2',
                    //     },
                    //     {
                    //         id: '33',
                    //         value: '150'
                    //     },
                    //     {
                    //         id: '44',
                    //         value: '300'
                    //     },
                    // ]
                    row: [
                        "Design",
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
                data-each="{properties.column}"
                data-key="column"
            > <span data-text="{column?.value}"></span> </th>
        </tr>
      </thead>
    `;

        const body = /*html*/`
      <tbody>
        <tr data-each="{properties.entries}" data-key="entry">
            <td data-each="{entry.row}" data-key="cell">
                <span data-text="{cell?.value || cell}"></span>
            </td>
        </tr>
      </tbody>
    `;

        return `<table>${header}${body}</table>`;
    }
};


export default { button, dropzone, heading, paragraph, divider, image, qrcode, dynamicTable }