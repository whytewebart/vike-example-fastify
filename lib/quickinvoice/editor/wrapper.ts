import type { Reactive, Attrs, Watch, EventListeners } from 'minze'
import css from './styles/wrapper.css?inline'
import { EditorWrapperBase } from './base'

export interface EditorWrapper {}
// DEFINE EVENT BUS
const tabBus = new BroadcastChannel('$wrapper-tabs');
// DEFAULT TABS
const tabs = {
    info: {
        title: 'Onboarding',
        icon: 'i-solar-info-circle-outline',
        action: () => {
            console.log('Preparing Onboarding')
            tabBus.postMessage('Preparing Onboarding')
        }
    },

    hide: {
        title: 'Hide Layout',
        icon: 'i-solar-alt-arrow-right-outline',
        action: () => {
            console.log('Hide Layout')
            tabBus.postMessage('Hide Layout')
        }
    },

    items: {
        title: 'Line Items',
        icon: 'i-solar-database-linear',
        action: () => {
            console.log('Set Line Items')
            tabBus.postMessage('Set Line Items')
        }
    },

    download: {
        title: 'Download Invoice',
        icon: 'i-solar-download-minimalistic-outline',
        action: () => {
            console.log('Download Invoice')
            tabBus.postMessage('Download Invoice')
        }
    },
}

export class EditorWrapper extends EditorWrapperBase {
    options = { cssReset: false }

    reactive: Reactive = [
        [ 'hello', 'world' ]
    ]

    watch: Watch = []

    // HANDLE CLASSES
    unocss = {
        
    }

    // TABS
    TABS = tabs

    wrapper = /*html*/`
        <div section="canvas">
            <div id="canvas-container">
                <slot></slot>
            </div>
        </div>
        <div section="panels" part="panels">
            <div section="content" part="content">
                <slot slot="tabs" name="tabs">
                    <div section="tabs">
                        ${Object.entries(this.TABS).map(([_, tab], index) => this.tabsButton(_, tab.title, tab.icon)).join(" ")}
                    </div>
                </slot>
                <slot name="panels">
                    <!-- Blocks -->
                    <div class="blocks">
                        <div class="py-3 xmd:py-2 px-4" flex="~ justify-between items-center" border="b-1" sticky top-0>
                            <p class="font-urbanist font-semibold">Layouts</p>
                            <span class="i-solar-alt-arrow-down-outline text-xl"></span>
                        </div>

                        <div class="min-h-4xl">
                            
                        </div>
                        <div class="py-3 xmd:py-2 px-4 bg-white" flex="~ justify-between items-center" border="b-1" sticky top-0>
                            <p class="font-urbanist font-semibold">Components</p>
                            <span class="i-solar-alt-arrow-down-outline text-xl"></span>
                        </div>
                        <div class="min-h-4xl"></div>

                    </div>
                    <!-- Customization -->
                    <div class="customize min-h-5xl">
                        <div class="py-2 px-4" flex="~ justify-between items-center" border="b-1" sticky top-0>
                            <p class="font-urbanist font-semibold">Editor</p>
                            <span class="i-solar-alt-arrow-down-outline text-xl"></span>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    `

    html = () => /*HTML*/`
        ${this.showWarn ? this.warn : ''}
        ${!this.showWarn ? this.wrapper : ''}
    `

    css = () => `
        @unocss-placeholder

        ${css}

        @media (min-width: ${this.canvas.dimension.width! + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
            #canvas-container {
                width: fit-content;
                height: var(--canvas-height);
            }

            [section="canvas"] {
                /* height: var(--calc-h-scale); */
                height: calc(var(--canvas-height) + var(--canvas-padding) + var(--canvas-padding));
                min-width: calc(var(--canvas-min-width) + var(--handle-padding) + var(--handle-padding));
            }
        }

        @media (min-height: ${this.canvas.dimension.height}px) {
            [section="canvas"] { height: var(--calc-handles); }
            div[section="panels"] { max-height: var(--calc-handles); }
        }
    `

    onStart() {
        this.handlers.hooks.start();
    }

    onReady() {
        this.handlers.hooks.ready()
    }
}