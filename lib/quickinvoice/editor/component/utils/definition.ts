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
            'background-color',
            'border-radius',
            'box-shadow',
            'border',
            'width'
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
        // {
        //     name: 'users',
        //     type: {
        //         type: 'array',
        //         itemType: {
        //             type: 'object',
        //             shape: [
        //                 {
        //                     name: 'name',
        //                     type: 'text',
        //                     defaultValue: 'John Doe'
        //                 },
        //                 {
        //                     name: 'age',
        //                     type: 'number',
        //                     defaultValue: 30
        //                 },
        //                 {
        //                     name: 'profilePicture',
        //                     type: 'image',
        //                     defaultValue: ''
        //                 },
        //                 {
        //                     name: "friends",
        //                     type: {
        //                         type: 'array',
        //                         itemType: {
        //                             type: 'object',
        //                             shape: [
        //                                 {
        //                                     name: 'name',
        //                                     type: 'text',
        //                                     defaultValue: 'Jane Doe'
        //                                 },
        //                                 {
        //                                     name: 'age',
        //                                     type: 'number',
        //                                     defaultValue: 28
        //                                 }
        //                             ]
        //                         }
        //                     },
        //                     defaultValue: []
        //                 },
        //                 {
        //                     name: 'family',
        //                     type: {
        //                         type: 'object',
        //                         shape: [
        //                             {
        //                                 name: 'father',
        //                                 type: 'text',
        //                                 defaultValue: 'John Sr.'
        //                             },
        //                             {
        //                                 name: 'mother',
        //                                 type: 'text',
        //                                 defaultValue: 'Jane Sr.'
        //                             }
        //                         ]
        //                     },
        //                     defaultValue: {
        //                         father: 'John Sr.',
        //                         mother: 'Jane Sr.'
        //                     }
        //                 }
        //             ]
        //         }
        //     },
        //     group: 'Data',
        //     description: 'List of users to display in the card.',
        //     defaultValue: []
        // },
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
                    <b data-text="{properties.client?.name}"></b>
                    <span data-text="{properties.title}"></span>
                </h3>
                <p data-if="{!properties.hideDescription}" data-text="{properties.description}"></p>
            </div>

            <div id="client">
                <h3>Client</h3>
                <h4 data-text="{properties.client?.name}"></h4>
                <p data-text="{properties.client?.email}"></p>
                <p data-text="{properties.client?.phone}"></p>
                <p data-text="{properties.client?.active ? 'Active' : 'Inactive'}"></p></h4>
            </div>
            
            <ul id="userList">
                <!--
                    data-each tells the engine “for each element in users”,
                    data-key names each loop variable “user”,
                    and {user.*} is evaluated for each object.
                -->
                <li data-each="{properties.users}" data-key="user">
                    <span data-text="{user.name}"></span>
                    – <span data-text="{user.age} years old"></span>
                    <img data-ifo="{user.profilePicture}" data-bind data-attr-src="{user.profilePicture}" data-bind data-attr-alt="{user.name}'s profile picture" />
                    <ul style="list-style-type: disc; margin-left: 20px;">
                        <li data-each="{user.friends}" data-key="friend">
                            <span data-text="{friend.name}"></span>
                            – <span data-text="{friend.age} years old"></span>
                        </li>
                    </ul>
                    <div data-if="{user.family}" class="family">
                        <span>Family:</span>
                        <h3 data-text="{user.family?.father}"></h3>
                        <h3 data-text="{user.family?.mother}"></h3>
                    </div>
                </li>
            </ul>

            <!-- hobbies -->
            <ul>
                <li data-each="{properties.hobbies}" data-key="hobby">
                    <span data-text="{hobby?.value}"></span>
                </li>
            </ul>

            <div class="card-body" tabindex="0"></div>
            <div data-if="{properties.showFooter}" class="card-footer" tabindex="0"></div>
        `
    }
};

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

            /* UNSET ALL DROPZONE STYLES IF NO SLOT */
            /* [dropzone]:not(:has(slot)) {
                all: unset
            }

            [dropzone]:not(:has(slot))::before {
                all: unset
            } */
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
        defaultStyles: {
            // 'font-size': '40px',
            // 'font-weight': 'bold',
            // 'color': '#333',
            'text-align': 'left',
            'margin-top': '0.5em',
            'margin-bottom': '0.5em'
        },
        css: (properties) => /*css*/`
            :host, h1, h2, h3, h4, h5, h6 {
                display: block;
                font-family: 'Urbanist';
            }
            /* h1 { font-size: 2.5em; }
            h2 { font-size: 2em; }
            h3 { font-size: 1.75em; }
            h4 { font-size: 1.5em; }
            h5 { font-size: 1.25em; }
            h6 { font-size: 1em; } */
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
            'font-size': '1em',
            'color': '#333',
            'text-align': 'left',
            'line-height': '1.5',
            'margin-top': '0.5em',
            'margin-bottom': '0.5em',
        },
        css: (properties) => /*css*/`
            :host, p {
                display: block;
                font-family: 'Urbanist';
            }

            p {
                white-space: pre-wrap;
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
                border-top-width: ${properties.thickness}px;
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
            defaultValue: ''
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
        defaultStyles: {
            'width': '100%',
            'height': 'auto',
            'border-radius': '0',
            'box-shadow': 'none'
        },
        css: (properties) => /*css*/`
            :host, img {
                display: block;
                max-width: 100%;
                height: auto;
            }

            img[src=""] {
                height: 100px;
                background-color: #f0f0f0;
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
        allowedProperties: [
            'width',
            'height',
            'padding',
            'background-color',
            'border-radius'
        ],
        defaultStyles: {
            // 'width': '128px',
            // 'height': '128px',
            // 'padding': '10px',
            // 'background-color': '#ffffff',
            // 'border-radius': '0px'
        },
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


export default { card, button, dropzone, heading, paragraph, divider, image, qrcode }