const card: ComponentDefinition = {
    type: 'card',
    name: 'Card',
    category: 'Containers',
    icon: '🃏',

    // Global capabilities
    capabilities: {
        canHaveChildren: 3,
        childrenLocked: true,
        canBeDeleted: true,
        canAcceptStyles: true,
        isContainer: false
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
            'box-shadow': '0 2px 8px rgba(0,0,0,0.1)',
            'width': '100%'
        },
        css: (properties) => /*css*/`
             .card {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

            .card-footer button {
                padding: 6px 12px;
                background-color: #2196f3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
            }

            .card-footer button:hover {
                background-color: #1976d2;
            }
        `
    },

    properties: [
        {
            name: 'title',
            type: 'text',
            defaultValue: 'Card Title',
            group: 'Header'
        },
        {
            name: 'description',
            type: 'text',
            defaultValue: '',
            group: 'Header'
        },
        {
            name: 'showFooter',
            type: 'boolean',
            defaultValue: true,
            group: 'Footer'
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
                canHaveChildren:  false
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
                isContainer: true
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
                    defaultValue: 'primary',
                    options: ['primary', 'secondary']
                },
                {
                    name: 'label',
                    type: 'text',
                    defaultValue: 'Save'
                }
            ],
            styleSettings: {
                defaultStyles: {
                    'background-color': 'green',
                    'color': '#ccc',
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
                    options: ['primary', 'secondary']
                },
                {
                    name: 'label',
                    type: 'text',
                    defaultValue: 'Cancel'
                },
                {
                    name: 'hello_label',
                    type: 'text',
                    defaultValue: 'Hello Placeholder'
                }
            ],
            selector: '.card-footer'
        }
    ],

    renderTemplate: (properties) => {
        return /*HTML*/`
        <div class="card">
            <div class="card-header">
                <h3>${properties.title}</h3>
                ${properties.description ? `<p>${properties.description}</p>` : ''}
            </div>
            <div class="card-body" tabindex="0"></div>
            ${properties.showFooter ? `<div class="card-footer" tabindex="0"></div>` : ''}
        </div>
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
            options: ['primary', 'secondary', 'text']
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
            // 'display': 'inline'
        }
    },

    renderTemplate: (properties) => /*html*/ `
    ${properties.label}
  `
};

export default { card, button }