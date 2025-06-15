<template>
  <div class="quickinvoice">
    <header class="py-4 bk-col-nav px-4 lg:px-6 space-y-2">
      <h3 class="font-space-mono tracking-tight text-xl font-semibold">InvoiceSpace.</h3>
      <p class="font-space-mono text-sm max-w-sm">Drag. Drop. Done. Create and customize professional invoices, download them as PDF, or email them to clients — all right here.</p>
      <Button rounded size="small" pt:label="font-space-mono" label="Get in Touch." severity="secondary" />
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.quickinvoice {
  --at-apply: viewport;
  --gap: 0em
}
</style>