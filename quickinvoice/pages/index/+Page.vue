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
      <InvoiceTemplate />
      <InvoiceTemplate />
      <InvoiceTemplate />
      <InvoiceTemplate />
    </div>
  </div>

  <editor-wrapper class="bk-col-root xxl:bk-col-nav sm:b-y-1">
    <editor-canvas> </editor-canvas>
  </editor-wrapper>
</template>

<script lang="tsx" setup>
import { SetupContext } from "vue";

const toggleTemplates = ref(false);

const InvoiceTemplate = (props: any, ctx: SetupContext) => {
  return (
    <div
      class="p-2 b-1 b-gray-300 grid grid-rows-[auto_1fr_auto] gap-y-2"
      invoice-temp
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
</style>
