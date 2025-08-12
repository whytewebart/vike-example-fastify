import type { Reactive, Attrs, Watch, EventListeners, MinzeElement } from "minze";
import { Minze } from "minze"
import css from "./styles/wrapper.css?inline";
import { EditorWrapperBase } from "./base/wrapper";

export interface EditorWrapper { }
export class EditorWrapper extends EditorWrapperBase {
  options = { cssReset: false };

  // TABS
  TABS: Record<string, {
    title: string;
    icon: string;
    action: (container: MinzeElement) => void;
    template?: string
  }> = {
      // info: {
      //   title: "Onboarding",
      //   icon: "i-solar-info-circle-outline",
      //   action: () => {
      //     console.log("Preparing Onboarding");
      //     channel.postMessage("Preparing Onboarding");
      //   },
      // },

      // hide: {
      //   title: "Hide Layout",
      //   icon: "i-solar-alt-arrow-right-outline",
      //   action: () => {
      //     console.log("Hide Layout");
      //     channel.postMessage("Hide Layout");
      //   },
      // },

      items: {
        title: "Layers",
        icon: "i-solar-layers-linear",
        action: () => {
          Minze.dispatch(`layers:tabs:toggle`)
        },
        template: /*html*/ `
          <editor-layers id="tabs" style="--right-offset: 42px;"></editor-layers>
          <style>
            editor-layers#tabs {
              position: absolute; top: 0;
              bottom: unset;
              right: var(--right-offset, 0);
              width: 250px;
            }
          </style>
        `
      },

      download: {
        title: "Download Invoice",
        icon: "i-solar-download-minimalistic-outline",
        action: () => {
          // channel.postMessage("download");
          this.dispatch('editor-canvas:download:print')
        },
      },
    };

  canvasTemplate = () => /*html*/`
    <div section="canvas">
      <div id="canvas-container">
          <slot></slot>
      </div>
    </div>
  `

  tabsPanel = () => /*html*/`
    <!-- TABS SECTION -->
    <div class="tabs-container relative">
      <div section="tabs">
        ${Object.entries(this.TABS)
      .map(([_, tab], index) =>
        this.tabsButton(_, tab.title, tab.icon, tab?.template)
      )
      .join(" ")}
      </div>
    </div>
  `

  blocksPanel = () => /*html*/`
    <div section="blocks-panel" class="relative">
      <!-- BLOCKS -->
      <editor-panel title="Elements" class="*:font-space-mono">
        <!-- <div class="block" data-type="card" draggable="true">card</div> -->
        <div class="block" data-type="heading" draggable="true">Heading</div>
        <div class="block" data-type="paragraph" draggable="true">Paragraph</div>
        <div class="block" data-type="telephone" draggable="true">Telephone</div>
        <div class="block" data-type="money" draggable="true">Localized Currency</div>
        <div class="block" data-type="image" draggable="true">Image</div>
        <div class="block" data-type="button" draggable="true">Button</div>
        <div class="block" data-type="qrcode" draggable="true">QR Code</div>
        <div class="block" data-type="fixed-table" draggable="true">Items Table</div>
        <div class="block" data-type="dynamic-table" draggable="true">Dynamic Table</div>
        <div class="block" data-type="signature" draggable="true">Signature</div>
      </editor-panel>
      <!-- LAYOUTS -->
      <editor-panel title="Layouts & Structure" class="*:font-space-mono">
        <div class="block" data-type="dropzone" draggable="true">Container</div>
        <div class="block" data-type="divider" draggable="true">Divider</div>
        <div class="block" data-type="spacer" draggable="true">Spacer</div>
        <div class="block" data-type="column-grid" draggable="true">2 Column Grid</div>
      </editor-panel>
      <!-- LAYOUTS -->
      <editor-panel title="Components" class="grid-col-span-2 border-y">
        <div class="block" data-type="recipient" draggable="true">Recipient</div>
        <div class="block" data-category="layout" data-type="issued-by" draggable="true">Issued By</div>
        <div class="block" data-category="layout" data-type="disclaimer" draggable="true">Disclaimer</div>
        <div class="block" data-type="social-links" draggable="true">Social Links</div>
        <div class="block" data-category="layout" data-type="payment-terms" draggable="true">Payment Terms</div>
      </editor-panel>
      <editor-panel title="Stacks & Sections" class="grid-col-span-2 border-y">
        <div class="block" data-category="layout" data-type="header-first" draggable="true">Header</div>
        <div class="block" data-category="layout" data-type="footer-01" draggable="true">Footer</div>
      </editor-panel>
      
      <slot name="panels-onboarding-div"></slot>
    </div>
  `

  wrapper = /*html*/ `
        <!-- CANVAS SECTION -->
        ${this.canvasTemplate()}
        <!-- PANELS SECTION -->
        <div section="panels" part="panels">
            <div section="content" part="content">
                <!-- TABS SLOT -->
                <slot slot="tabs" name="tabs">
                    ${this.tabsPanel()}
                </slot>
                <!-- PANELS SLOT -->
                <div class="relative" section="panels_grid">
                    ${this.blocksPanel()}
                      <!-- CUSTOMIZATION -->
                      <div class="hide-component relative min-h-41px">
                        <div class="px-4 py-2 bg-white b-b-1 hover:cursor-pointer absolute top-0 left-0 right-0 z-20" layers-btn>
                          <p class="font-space-mono font-semibold">Layers</p>
                        </div>
                        <editor-layers id="mobiletab"></editor-layers>
                      </div>
                      <div relative>
                        <editor-panel title="Editor">
                          <style-editor></style-editor>
                        </editor-panel>
                        <slot name="style-editor-onboarding-div"></slot>
                      </div>
                      <div class="hide-component w-full sticky bottom-0 z-30 p-2">
                        <button id="download-invoice" class="py-2 px-4 text-center bg-primary-700 text-primary-100 w-full font-sans font-semibold transition-all rounded-lg" hover="bg-primary-600">Download Invoice</button>
                      </div>
                    </div>
              </div>
          </div>
      </div>
    `;

  html = () => /*HTML*/ `
        ${this.showWarn ? this.warn : ""}
        ${!this.showWarn ? this.wrapper : ""}
    `;

  css = () => `
        @unocss-placeholder

        ${css}

        [data-type] { padding: 10px; }

        @media (min-width: ${this.canvas.dimension.width! + this.CANVAS_PADDING + this.HANDLE_PADDING}px) {
            #canvas-container {
              width: fit-content;
              height: var(--canvas-height);
            }

            [section="canvas"] {
              min-height: calc(var(--canvas-height) + var(--canvas-padding) + var(--canvas-padding));
              min-width: calc(var(--canvas-min-width) + var(--handle-padding) + var(--handle-padding));
            }
        }

        @media (min-height: ${this.canvas.dimension.height}px) {
            /* [section="canvas"] { min-height: var(--calc-handles); } */
            [section="canvas"] { max-height: var(--calc-handles); }
            div[section="panels"] { max-height: var(--calc-handles); }
        }
    `;

  onStart() {
    this.handlers.hooks.start();
  }

  onReady() {
    this.handlers.hooks.ready();
  }

  eventListeners?: EventListeners = [
    [
      ".block",
      "dragstart",
      (e) => {
        const element = e.target?.closest(".block");
        const content = element.dataset.category ? `${element.dataset.category}-${element.dataset.type}` : element.dataset.type;

        e.dataTransfer.setData("text/plain", content);
        e.dataTransfer.effectAllowed = "copy";
        this.dispatch("canvas:component:dragstart", {
          isDraggingNewComponent: true,
        });
      },
    ],
    [
      "[section='canvas']",
      "click",
      (e) => {
        /* console.log(e.target, e.target?.closest('[section="canvas"]')) */
        if (e.target?.closest('[section="canvas"]') == e.target) {
          /* console.log("Deselect component"); */
          this.dispatch("canvas:component:deselect");
        }
      }
    ],
    [
      "[layers-btn]",
      "click",
      () => {
        this.dispatch("layers:mobiletab:toggle")
      }
    ],
    [
      "#download-invoice",
      "click",
      () => {
        this.dispatch('editor-canvas:download:print')
      }
    ]
  ];
}
