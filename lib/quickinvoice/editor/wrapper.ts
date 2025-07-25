import { type Reactive, type Attrs, type Watch, type EventListeners, type MinzeElement, Minze } from "minze";
import css from "./styles/wrapper.css?inline";
import { EditorWrapperBase } from "./base/wrapper";

export interface EditorWrapper { }
// DEFINE EVENT BUS
const channel = new BroadcastChannel("wrapper-tabs");
// DEFAULT TABS
const tabs: Record<string, {
  title: string;
  icon: string;
  action: (container: MinzeElement) => void;
  template?: string
}> = {
  info: {
    title: "Onboarding",
    icon: "i-solar-info-circle-outline",
    action: () => {
      console.log("Preparing Onboarding");
      channel.postMessage("Preparing Onboarding");
    },
  },

  hide: {
    title: "Hide Layout",
    icon: "i-solar-alt-arrow-right-outline",
    action: () => {
      console.log("Hide Layout");
      channel.postMessage("Hide Layout");
    },
  },

  items: {
    title: "Layers",
    icon: "i-solar-layers-linear",
    action: (container) => {
      const layers = container.select("editor-layers#layers");
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
      console.log("Download Invoice");
      channel.postMessage("Download Invoice");
    },
  },
};

export class EditorWrapper extends EditorWrapperBase {
  options = { cssReset: false };

  // TABS
  TABS = tabs;

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
    <div section="blocks-panel">
      <!-- BLOCKS -->
      <editor-panel title="Components" class="*:font-space-mono">
        <div class="block" data-type="heading" draggable="true">Heading</div>
        <div class="block" data-type="paragraph" draggable="true">Paragraph</div>
        <div class="block" data-type="image" draggable="true">Image</div>
        <div class="block" data-type="button" draggable="true">Button</div>
        <div class="block" data-type="divider" draggable="true">Divider</div>
        <div class="block" data-type="dropzone" draggable="true">Container</div>
        <div class="block" data-type="card" draggable="true">Card</div>
        <slot name="blocks-slot"></slot>
      </editor-panel>
      <!-- LAYOUTS -->
      <editor-panel title="Layouts" class="grid-col-span-2 border-y">
        <div class="min-h-4xl"></div>
      </editor-panel>
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
                <slot name="panels">
                    <div section="panels_grid">
                      ${this.blocksPanel()}
                      <!-- CUSTOMIZATION -->
                      <editor-panel title="Editor">
                        <style-editor></style-editor>
                      </editor-panel>
                    </div>
                  </slot>
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
            /* [section="canvas"] { min-height: var(--calc-handles); }
            div[section="panels"] { max-height: var(--calc-handles); } */
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

        e.dataTransfer.setData("text/plain", element.dataset.type);
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
    ]
  ];
}
