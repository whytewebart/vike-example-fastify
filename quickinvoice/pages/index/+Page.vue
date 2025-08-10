<template>
  <Button
    label="Select invoice template"
    icon="i-solar-alt-arrow-down-outline"
    icon-pos="right"
    pt:root="justify-between w-fit gap-x-8 mx-a"
    pt:label="flex-none"
    @click="toggleTemplates = !toggleTemplates"
  />

  <div class="bk-col-full my-4" invoice-temp-grid>
    <div v-if="toggleTemplates">
      <InvoiceTemplate type="template01" />
      <InvoiceTemplate />
      <InvoiceTemplate />
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
        'bg-white! p-0! app-scrollbar rounded-none! border-none! lg:overflow-x-hidden [&::-webkit-scrollbar]:hidden!',
      root: 'max-sm:rounded-none overflow-clip max-w-full',
      mask: 'bg-surface-50/20! backdrop-blur-sm!',
    }"
    @show="getPrint"
  >
    <div id="download-print"></div>

    <div class="sticky bottom-0 left-0 right-0 p-2" grid="~ sm:cols-2 gap-2">
      <Button
        label="Close Window"
        pt:root=""
        severity="secondary"
        fluid
        @click="visible = false"
      />
      <Button label="Download as PDF" pt:root=" bg-primary-700" fluid />
    </div>
  </Dialog>

  <editor-wrapper
    class="bk-col-root xxl:bk-col-nav sm:b-y-1"
    :class="{ 'temp-open': toggleTemplates }"
  >
    <editor-canvas> </editor-canvas>
  </editor-wrapper>
</template>

<script lang="tsx" setup>
import { SetupContext } from "vue";

const visible = ref(false);
const toggleTemplates = ref(false);

const confirm = useConfirm();
const toast = useToast();

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
        label: "Save",
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
        )

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
          summary: "Rejected",
          detail: "You have rejected",
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

onMounted(() => {
  window.addEventListener("print-invoice", getPrint);
});

onUnmounted(() => {
  window.removeEventListener("print-invoice", getPrint);
});
</script>

<style lang="scss">
body:has(.quickinvoice) {
  --at-apply: bg-alabaster!;
}

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
</style>
