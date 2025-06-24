import type { Reactive, Attrs, Watch, EventListeners } from "minze";
import css from "../styles/wrapper.css?inline";
import { EditorWrapperBase } from "./base";

export interface EditorWrapper {}
// DEFINE EVENT BUS
const tabBus = new BroadcastChannel("$wrapper-tabs");
// DEFAULT TABS
const tabs = {
  info: {
    title: "Onboarding",
    icon: "i-solar-info-circle-outline",
    action: () => {
      console.log("Preparing Onboarding");
      tabBus.postMessage("Preparing Onboarding");
    },
  },

  hide: {
    title: "Hide Layout",
    icon: "i-solar-alt-arrow-right-outline",
    action: () => {
      console.log("Hide Layout");
      tabBus.postMessage("Hide Layout");
    },
  },

  items: {
    title: "Line Items",
    icon: "i-solar-database-linear",
    action: () => {
      console.log("Set Line Items");
      tabBus.postMessage("Set Line Items");
    },
  },

  download: {
    title: "Download Invoice",
    icon: "i-solar-download-minimalistic-outline",
    action: () => {
      console.log("Download Invoice");
      tabBus.postMessage("Download Invoice");
    },
  },
};

export class EditorWrapper extends EditorWrapperBase {
  options = { cssReset: false };

  // TABS
  TABS = tabs;

  wrapper = /*html*/ `
        <!-- CANVAS SECTION -->
        <div section="canvas">
            <div id="canvas-container">
                <slot></slot>
            </div>
        </div>
        <!-- PANELS SECTION -->
        <div section="panels" part="panels">
            <div section="content" part="content">
                <!-- TABS SLOT -->
                <slot slot="tabs" name="tabs">
                    <!-- TABS SECTION -->
                    <div section="tabs">
                      ${Object.entries(this.TABS)
                        .map(([_, tab], index) =>
                          this.tabsButton(_, tab.title, tab.icon)
                        )
                        .join(" ")}
                    </div>
                </slot>
                <!-- PANELS SLOT -->
                <slot name="panels">
                    <!-- BLOCKS -->
                    <editor-panel title="Components" class="*:font-space-mono">
                      <div class="block" data-type="heading" draggable="true">Heading</div>
                      <div class="block" data-type="paragraph" draggable="true">Paragraph</div>
                      <div class="block" data-type="image" draggable="true">Image</div>
                      <div class="block" data-type="button" draggable="true">Button</div>
                      <div class="block" data-type="divider" draggable="true">Divider</div>
                      <div class="block" data-type="container" draggable="true">Container</div>
                      <div class="block" data-type="test" draggable="true">Test Component</div>
                    </editor-panel>
                    <!-- CUSTOMIZATION -->
                    <editor-panel title="Editor">
                      <div class="min-h-5xl"></div>
                    </editor-panel>
                    <!-- LAYOUTS -->
                    <editor-panel title="Layouts" class="grid-col-span-2 border-y">
                      <div class="min-h-4xl"></div>
                    </editor-panel>
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

        [data-type] {
            padding: 10px;
        }

        @media (min-width: ${
          this.canvas.dimension.width! +
          this.CANVAS_PADDING +
          this.HANDLE_PADDING
        }px) {
            #canvas-container {
                width: fit-content;
                height: var(--canvas-height);
            }

            [section="canvas"] {
                /* height: var(--calc-h-scale); */
                /* height: calc(var(--canvas-height) + var(--canvas-padding) + var(--canvas-padding)); */
                min-height: calc(var(--canvas-height) + var(--canvas-padding) + var(--canvas-padding));
                min-width: calc(var(--canvas-min-width) + var(--handle-padding) + var(--handle-padding));
            }
        }

        @media (min-height: ${this.canvas.dimension.height}px) {
            [section="canvas"] {
              /* height: var(--calc-handles); */
              min-height: var(--calc-handles);
            }
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

        e.dataTransfer.setData("text/plain", element.dataset.type);
        e.dataTransfer.effectAllowed = "copy";
        this.dispatch("canvas:component:dragstart", {
          isDraggingNewComponent: true,
        });
      },
    ],
  ];
}
