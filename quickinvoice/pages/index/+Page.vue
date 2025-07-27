<template>
  <div class="bk-col-max bg-alabaster" border="x-1">
    <div class="m-4">
      <!-- <img src="/brandmark.png" width="50" alt=""> -->
      <h3 class="font-space-mono font-bold">Invoicespace (Preview)</h3>
      <p class="text-sm max-w-sm mt-2">Drag. Drop. Done. Create and customize professional invoices, download them as PDF, or email them to clients — all right here.</p>
    </div>
  </div>
  <div class="bk-col-full py-2" border="t-1">
    <Select :option="[]" placeholder="Select Template" size="small" fluid pt:root="max-sm:mx-2" />
  </div>
  <editor-wrapper class="bk-col-nav b-y-1 [contain:content]">
    <editor-canvas> </editor-canvas>
  </editor-wrapper>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
#view-content {
  all: unset;
}

html,
body {
  --at-apply: app-scrollbar;

  &::-webkit-scrollbar-track {
    --at-apply: bg-gray-200;
  }

  &::-webkit-scrollbar-button {
    --at-apply: bg-red;
  }
}

:not(:defined) {
  visibility: hidden;
}
</style>
