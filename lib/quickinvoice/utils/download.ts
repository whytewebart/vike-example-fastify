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

const print = async () => {
    // INITIALIZE DB
    db.initialize();
    if (!indexeddb.space) {
        Minze.dispatch('indexeddb:space:request');
        return print()
    };

    const spaces = await indexeddb.space?.findByIndex("latest", "true");
    if (!(spaces.length > 0)) return;

    const editor = document.querySelector(`editor-canvas[editor-id="${spaces[0].id}"]`);
    const editorDom = editor?.shadowRoot

    if (!editor || !editorDom) return;

    const divToDownload = document.createElement('div');
    const canvas = editorDom.querySelector("#canvas")!
    const canvasChildren: EditorComponent[] = Array.from(canvas.querySelectorAll('editor-component'))

    const _uniqueId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

    function recurisveNestedFind(el: EditorComponent) {
        const element = document.createElement('div');
        // DEFINE UNIQUE IDS
        const hostId = _uniqueId()
        // DEFINE SANITIZED DOM
        const _html = el.shadowRoot?.innerHTML!.replaceAll(/(?<!:)\bhost\b/g, hostId)
        const _css = el.privateCss().replaceAll(/(?<!:)\bhost\b/g, hostId)
        // APPEND HTML
        element.innerHTML += _html;
        element.innerHTML += `<style>${_css}</style>`;
        // REMOVE DRAG HANDLE
        element.querySelector('button#handle')?.remove();
        element.querySelector('style[ref="button-handle"]')?.remove();
        // GET ID
        const id = el.getAttribute("id")!
        const query = <NodeListOf<EditorComponent>>element?.querySelectorAll('editor-component');

        for (const nested of query) {
            const id = nested.getAttribute("id")!;
            const element = <EditorComponent>el.shadowRoot?.querySelector(`[id="${id}"]`)
            const response = recurisveNestedFind(element)
            const key = Object.keys(response)[0]
            const { html } = response[key];

            nested.parentElement?.appendChild(html);
            nested.remove();
        }

        return {
            [id]: {
                html: document.createRange().createContextualFragment(element?.innerHTML)
            }
        }
    }

    Array.from(canvasChildren)
        .map(el => recurisveNestedFind(el))
        .forEach(entry => {
            const key = Object.keys(entry)[0];
            const { html } = entry[key];

            Array.from(html.children)
                .forEach(el => divToDownload.innerHTML += el.outerHTML)
        });

    divToDownload.innerHTML += /*html*/`
        <style>
            ${resetcss}
            ${componentCss}
        </style>
    `

    // REMOVE ALL SLOTS
    divToDownload.querySelectorAll('slot').forEach(slot => slot.remove())
    // SET INVOICE CONTAINER STYLES
    const styles = {
        width: '535px',
        height: '760px',
        display: 'flex',
        'flex-direction': 'column',
        background: 'white'
    }
    divToDownload
        .setAttribute('style',
            Object.entries(styles)
                .map(([key, value]) => `${key}:${value}`)
                .join(';')
        )

    window.invoiceHTML = document.createRange()
        .createContextualFragment(divToDownload.outerHTML);
    Minze.dispatch('print-invoice', {
        toPrint: window.invoiceHTML,
    })
}

// LISTEN
db.listen();
const channel = new BroadcastChannel("wrapper-tabs");
channel.addEventListener("message", (event) => {
    const { data } = event;

    if (data === 'download') {
        print()
    }

});