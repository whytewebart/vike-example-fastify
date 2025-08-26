<template>
  <ButtonGroup pt:root="mx-a" max-xs="grid [&>[data-pc-name=button]]:rounded-md!">
    <Button
      label="Select invoice template"
      icon="i-solar-alt-arrow-down-outline"
      icon-pos="right"
      pt:root="justify-between w-fit gap-x-8"
      pt:label="flex-none"
      @click="toggleTemplates = !toggleTemplates"
      id="select-invoice-template"
    />
    <Button label="Onboarding" severity="secondary" @click="startTour" />
  </ButtonGroup>

  <div class="bk-col-full my-4" invoice-temp-grid>
    <div v-if="toggleTemplates">
      <InvoiceTemplate type="template01" />
      <InvoiceTemplate type="pastel-template" />
      <InvoiceTemplate type="redline-template" />
      <InvoiceTemplate />
    </div>

    <Button
      label="[ Show Editor ]"
      @click="toggleTemplates = !toggleTemplates"
      fluid
      pt:root="mt-4 lg:hidden"
      severity="secondary"
      v-if="toggleTemplates"
    />
  </div>

  <Dialog
    v-model:visible="visible"
    :show-header="false"
    dismissable-mask
    modal
    :pt="{
      content:
        'p-0! app-scrollbar rounded-none! border-none! lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden!',
      root: 'bg-transparent! max-sm:rounded-none overflow-clip max-w-full',
      mask: 'bg-surface-50/20! backdrop-blur-sm!',
    }"
    @show="getPrint"
  >
    <div class="w-full" flex="~ justify-center">
      <Button label="[ Refresh to fix layout issues ]" @click="reloadWindow" pt:root="bg-white mb-2 py-1! px-2" size="small" severity="secondary" />
    </div>
    <div id="download-print"></div>

    <div class="sticky bottom-0 left-0 right-0 p-2 bg-white b-t-1" grid="~ cols-2 gap-2">
      <Button
        label="Close Window"
        pt:root=""
        severity="secondary"
        fluid
        @click="visible = false"
        size="small"
      />
      <Button label="Download as PDF" pt:root=" bg-primary-700" @click="download" size="small" fluid />
    </div>
  </Dialog>

  <editor-wrapper
    class="bk-col-root xxl:bk-col-nav sm:b-y-1"
    :class="{ 'temp-open': toggleTemplates }"
  >
    <editor-canvas></editor-canvas>
    <div
      slot="panels-onboarding-div"
      class="p-3 h-full absolute top-0 left-0 right-0 -z-1"
    ></div>
    <div
      slot="style-editor-onboarding-div"
      class="p-3 h-full absolute top-0 left-0 right-0 -z-1"
    ></div>
  </editor-wrapper>
</template>

<script lang="tsx" setup>
import { useInvoice } from "@/composables/quickinvoice/download";
import type { TourGuideClient } from "@sjmc11/tourguidejs";
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep";
import { SetupContext } from "vue";

const visible = ref(false);
const toggleTemplates = ref(false);

const tg = ref<TourGuideClient>();
const { download } = useInvoice()
const confirm = useConfirm();
const toast = useToast();
const breakpoints = useBreakpoints({
  xs: 0,
  sm: 640,
  md: 768,
  editor: 1000,
});

const InvoiceTemplate = (props: { type?: string }, ctx: SetupContext) => {
  const emitRegsiterTemplate = () => {
    if (!props.type) {
      return alert("Type is missing from component");
    }

    confirm.require({
      message:
        "<b>Are you sure you want to proceed?</b> This Action will replace the current template.",
      header: "Confirm Action",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Continue",
      },
      accept: () => {
        window.dispatchEvent(
          new CustomEvent("components:register-template", {
            detail: {
              template: {
                type: props.type,
              },
            },
          })
        );

        toggleTemplates.value = false;
        toast.add({
          severity: "info",
          summary: "Template Registered",
          detail: "Template has been registered successfully",
          life: 3000,
        });
      },
      reject: () => {
        toast.add({
          severity: "error",
          summary: "Action Canceled",
          // detail: "You have rejected",
          life: 3000,
        });
      },
    });
  };

  return (
    <div
      class="p-2 b-1 b-gray-300 grid grid-rows-[auto_1fr_auto] gap-y-2"
      invoice-temp
      onClick={emitRegsiterTemplate}
    >
      <div class="flex items-center justify-between font-600 text-sm">
        <p class="">[01]</p>
        <p class="">[ Logo, QR Code, Dropzone ]</p>
      </div>
      <div class="bg-white h-xs w-full"></div>
      <h3 class="text-right text-xl font-epilogue font-500 tracking-tight">
        Derauke Black
      </h3>
    </div>
  );
};

function getPrint() {
  if (window.invoiceHTML) {
    document.querySelector("#download-print")?.replaceWith(window.invoiceHTML);
    visible.value = true;
  }
}

function reloadWindow() {
  window.location.reload()
}

const steps = ref<TourGuideStep[]>([
  {
    target: "editor-wrapper", // no specific target, overlays the whole screen
    title: "Welcome to InvoiceSpace Editor!",
    content: `
      <p>This is where you create and customize invoices. Let’s take a quick tour so you can start building like a pro.</p>
      <p><em>You can skip at any time.</em></p>
    `,
  },
  {
    target: "editor-canvas",
    title: "The Canvas",
    content: `
      <p>This is your live preview area. Everything you change in the editor appears here instantly. Click elements to select and customize them.</p>
    `,
  },
  {
    target: "[slot=panels-onboarding-div]",
    title: "Components",
    content: `
      <p>Here you’ll find building blocks for your invoice — headers, tables, totals, and more. Drag and drop them into the canvas to add them to your design.</p>
    `,
  },
  {
    target: "[slot=style-editor-onboarding-div]",
    title: "The Editor Panel",
    content: `
      <p>Once you select something on the canvas, you can customize it here. It’s divided into two sections: Styles and Properties.</p>
    `,
  },
  {
    target: "[slot=style-editor-onboarding-div]",
    title: "Styles Editor",
    content: `
      <p>Here you can adjust colors, fonts, spacing, and other visual settings for your selected component.</p>
  <p class="font-semibold text-base my-2"><strong>Tip:</strong> Use the <em>Select Nested Elements</em> dropdown to target and style specific parts within the component.</p>

  <p>Different components will show different nested elements, depending on their structure.</p>
    `,
    beforeEnter() {
      window.dispatchEvent(new CustomEvent("canvas:select:random"));
      window.dispatchEvent(
        new CustomEvent("onnboarding:style-editor-switch", {
          detail: {
            tab: "styles",
          },
        })
      );
    },
  },
  {
    target: "[slot=style-editor-onboarding-div]",
    title: "Properties Editor",
    content: `
      <p>Control content, data bindings, and specific settings for your selected element. Perfect for editing text, numbers, and dynamic fields.</p>
    `,
    beforeEnter() {
      window.dispatchEvent(
        new CustomEvent("onnboarding:style-editor-switch", {
          detail: {
            tab: "properties",
          },
        })
      );
    },
  },
  {
    target: "body",
    title: "You’re all set!",
    content: `
      <p>Now it’s your turn — add components, style them, and send your first invoice.</p>
      <p><em>Tip: You can restart this tour anytime from the Help menu.</em></p>
    `,
  },
]);
function startTour() {
  tg.value?.start();
}

onMounted(async () => {
  window.addEventListener("print-invoice", getPrint);
  const { TourGuideClient } = await import("@sjmc11/tourguidejs");

  const valid = breakpoints.isSmallerOrEqual('editor');
  if(valid) {
    steps.value = steps.value.map((step) => {

      if (step.target === "editor-wrapper") step.target = undefined;
      if (step.target === "[slot=panels-onboarding-div]") {
        step.target = "#select-invoice-template";
        step.title = "Select a Template"
        step.content = `<p>Start faster by choosing a pre-designed invoice template. Click <strong>Select Template</strong> at the top of the editor to browse and load a design instantly.</p>
        <p>You can still customize everything later — fonts, colors, layout, and more.</p>`
      };

      return step
    })
  }

  tg.value = new TourGuideClient({
    steps: steps.value,
  });
});

onUnmounted(() => {
  window.removeEventListener("print-invoice", getPrint);
});
</script>

<style lang="scss">
div[invoice-temp] {
  &:hover {
    --at-apply: bg-white;
    & > div.bg-white {
      --at-apply: bg-transparent;
    }
  }
}

div[invoice-temp-grid] {
  container-type: inline-size;
  container-name: invoice-temp-grid;

  & > div {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
}

@container invoice-temp-grid (min-width: 630px) {
  div[invoice-temp-grid] > div {
    // --at-apply: grid-cols-3
  }
}

.temp-open {
  --at-apply: max-lg:h-0 max-lg:overflow-hidden;
}

.tg-dialog-header {
  @apply: pt-2! px-3!;
}

.tg-dialog-body {
  @apply: p-3!;
}

.tg-dialog-footer {
  @apply: p-3!;
}
</style>
