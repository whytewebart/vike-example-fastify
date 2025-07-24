import Minze from "minze";
import { IndexedDBWrapper } from "../editor/component/utils/state";
import { EditorComponent } from "../editor/component";

import componentCss from '../editor/styles/component.css?inline'
import resetcss from "@unocss/reset/tailwind-compat.css?inline"
import { customAlphabet, nanoid } from "nanoid";
// TYPES
type _DB = {
    session: IndexedDBWrapper<DB.Session> | null,
    space: IndexedDBWrapper<DB.Space> | null
}

type IDBListener = Event & {
    detail: {
        store: "space" | "session";
        db: IndexedDBWrapper;
        [key: string]: any
    }
}

// END TYPES

var indexeddb: _DB = {
    session: null,
    space: null
}

const primitiveComponents = [
    "heading", "paragraph", "button", "divider", "image"
]

// INITIALIZE DB
const db = {
    initialize() {
        [
            "session",
            "space"
        ].forEach((store) => {
            // @ts-ignore
            if (!indexeddb[store]) {
                Minze.dispatch(`indexeddb:${store}:request`)
            }
        })
    },
    listen() {
        Minze.listen('indexeddb:open', (payload: IDBListener) => {
            const { detail } = payload;
            if (!indexeddb[detail.store])
                indexeddb[detail.store] = detail.db;
        })
    }
}

const createComponent = (
    type: string,
    attrs: Record<string, any> = {}
) => {
    // CREATE COMPONENT ELEMENT
    var component = document.createElement('editor-component')
    component.setAttribute('type', type);
    // SET EMPTY DEFAULTS
    ["properties", "styles", "sub-elements", "attr-definition", "id"]
        .forEach(attr => {
            let val = attrs[attr] || '';
            typeof val !== 'string' ? val = JSON.stringify(val) : null;
            component.setAttribute(attr, val)
        })

    return component
}

function processComponent(component: EditorComponent) {
    const type = component.getAttribute("type")!;
    const innerHtml = component.shadowRoot;

    // If it's a primitive component, add its HTML and CSS
    if (primitiveComponents.includes(type)) {
        return {
            id: {
                html: innerHtml?.innerHTML,
                stylesheet: component.privateCss()
            }
        }
    }

    // Recursively process any nested editor-components
    const nestedComponents = <NodeListOf<EditorComponent>>innerHtml?.querySelectorAll('editor-component');
    nestedComponents?.forEach((nestedComponent) => {
        processComponent(nestedComponent);
    });
}


const print = async () => {
    // INITIALIZE DB
    db.initialize();
    /*
        GET ALL THE ELEMENTS
        GET CURRENT SPACE
    */
    var CURRENT;
    if (!indexeddb.space) {
        Minze.dispatch('indexeddb:space:request');
        return print()
    }
    const __spaces = await indexeddb.space?.findByIndex("latest", "true");
    if (!(__spaces.length > 0))
        return;

    CURRENT = __spaces[0];
    const editor = document.querySelector(`editor-canvas[editor-id="${CURRENT.id}"]`);
    const editorDom = editor?.shadowRoot

    if (!editor || !editorDom)
        return;

    const divToDownload = document.createElement('div');
    const canvas = editorDom.querySelector("#canvas")!
    const canvasChildren: EditorComponent[] = Array.from(canvas.querySelectorAll('editor-component'))

    const _uniqueId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

    function recurisveNestedFind(el: EditorComponent) {
        const element = document.createElement('div');
        // unique ids
        const uniqueIds = {
            class: _uniqueId(),
            host: _uniqueId()
        }

        element.innerHTML = /*html*/`
            <div class="${uniqueIds.class}">
                ${el.shadowRoot?.innerHTML!
                .replaceAll(/(?<!:)\bhost\b/g, uniqueIds.host)}
            </div>
            <style>
                @scope (.${uniqueIds.class}) {
                ${el.privateCss()
                .replaceAll(/(?<!:)\bhost\b/g, uniqueIds.host)}
                }
            </style>
        `;
        // remove drag handle
        element.querySelector('button#handle')?.remove();
        element.querySelector('style[ref="button-handle"]')?.remove();
        // ------------------------------
        const id = el.getAttribute("id")!
        const nested = <NodeListOf<EditorComponent>>element?.querySelectorAll('editor-component');

        for (const nestedElement_ of nested) {
            // check if component is primitive
            const nestedUniqueId = _uniqueId()
            const nestedReplaceHost = _uniqueId();
            // --------------------
            const nestedType = nestedElement_.getAttribute("type")!
            const nestedId = nestedElement_.getAttribute("id")!;

            const nestedElement = <EditorComponent>el.shadowRoot?.querySelector(`[id="${nestedId}"]`)

            if (primitiveComponents.includes(nestedType)) {
                const entry = /*html*/`
                    <div class="${nestedUniqueId}">
                        ${nestedElement?.shadowRoot?.innerHTML.replaceAll(/(?<!:)\bhost\b/g, nestedReplaceHost)}
                    </div>
                    <style>
                        @scope (.${nestedUniqueId}) {
                            ${nestedElement?.privateCss().replaceAll(/(?<!:)\bhost\b/g, nestedReplaceHost)}
                        }
                    </style>
                `;

                nestedElement_.parentElement?.appendChild(document.createRange().createContextualFragment(entry));
                nestedElement_.remove();
            }

            else {
                // --------------------
                const response = recurisveNestedFind(nestedElement)
                const key = Object.keys(response)[0]
                // --------------------
                const { html, stylesheet } = response[key];
                nestedElement_.parentElement?.appendChild(document.createRange().createContextualFragment(html));
                nestedElement_.remove();
            }
        }

        return {
            [id]: {
                html: element?.innerHTML,
                stylesheet: el.privateCss().replaceAll(/(?<!:)\bhost\b/g, uniqueIds.host)
            }
        }
    }

    Array.from(canvasChildren)
        .map(el => recurisveNestedFind(el))
        .forEach(entry => {
            const key = Object.keys(entry)[0];
            const { html } = entry[key];

            divToDownload.innerHTML += html
        })

    divToDownload.innerHTML += /*html*/`
        <style>
            ${resetcss}
            ${componentCss}
        </style>
    `

    // REMOVE ALL SLOTS
    divToDownload.querySelectorAll('slot').forEach(slot => {
        slot.remove()
    })

    console.log(divToDownload)
    document.body.appendChild(divToDownload)
}