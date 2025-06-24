import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import { MinzeElement } from 'minze'

export interface EditorComponentTest {
    properties: Record<string, string | number | boolean>
}

const cardInstance: ComponentInstance = {
    id: 'card-123',
    type: 'card',
    childrenIds: ['btn-save-456', 'btn-cancel-789', 'text-101'],

    properties: {
        title: 'User Settings',
        description: 'Update your profile information',
        showFooter: true
    },

    styles: {
        'background-color': '#f8f9fa',
        'width': '400px'
    },

    subElements: {
        header: {
            styles: {
                'padding': '16px',
                'border-bottom': '1px solid #eee'
            }
        },
        body: {
            styles: {
                'padding': '24px'
            }
        },
        footer: {
            styles: {
                'padding': '16px',
                'border-top': '1px solid #eee'
            }
        }
    },

    meta: {
        visible: true,
        updatedAt: '2023-05-20T10:00:00Z',
        createdAt: '2023-05-20T10:00:00Z',
    }
};

export class EditorComponentTest extends MinzeElement {
    reactive: Reactive = [
        ['properties', cardInstance.properties]
    ]

    html = () => `
        <editor-component
            type='${cardInstance.type}'
            properties='${JSON.stringify(this.properties)}'
            styles='${JSON.stringify(cardInstance.styles)}'
            subElements='${JSON.stringify(cardInstance.subElements)}'
            component-instance='${JSON.stringify(cardInstance)}'
        ></editor-component>
        <input
            property="title"
            placeholder="Title Property"
            value="${this.properties.title}"
        />

        <input type="checkbox" />
    `

    eventListeners: EventListeners = [
        ['[property="title"]', 'input', (event: InputEvent) => {
            const inputEl = this.select('[property="title"]') as HTMLInputElement;
            this.properties.title = inputEl.value
        }],
        [
            'input[type="checkbox"]', 'input', (event) => {
                const inputEl = this.select('input[type="checkbox"]') as HTMLInputElement;
                this.properties.showFooter = inputEl.checked;
            }
        ]
    ]
}