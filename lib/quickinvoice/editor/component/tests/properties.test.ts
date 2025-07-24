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
                'padding': '34px'
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
        ['properties', {
            title: 'User Settings',
            description: 'Update your profile information',
            showFooter: false
        }]
    ]

    html = () => `
        <!-- <editor-component
            type='card'
            properties=''
            styles=''
            subElements=''
            component-instance=''
        ></editor-component> -->
        <input
            property="title"
            placeholder="Title Property"
            value="${this.properties.title}"
        />

        <input type="checkbox" checked="${this.properties.showFooter}" />
    `

    eventListeners: EventListeners = [
        ['input[property="title"]', 'input', (event: InputEvent) => {
            const inputEl = this.select('[property="title"]') as HTMLInputElement;
            this.properties.title = inputEl.value;

            const p = document.getElementsByTagName('editor-component');
            this.dispatch(`component:${p.item(0)?.id}:properties`, { title: inputEl.value })
        }],
        [
            'input[type="checkbox"]', 'input', (event) => {
                const inputEl = this.select('input[type="checkbox"]') as HTMLInputElement;
                this.properties.showFooter = inputEl.checked;

                const p = document.getElementsByTagName('editor-component');
                this.dispatch(`component:${p.item(0)?.id}:properties`, { showFooter: inputEl.checked })
            }
        ]
    ]
}