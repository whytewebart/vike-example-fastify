<template>
  <div class="quickinvoice">
    <header class="py-4 bk-col-nav px-6" flex="~ justify-between items-center" border="b-1">
      <h3 class="font-urbanist tracking-tight text-xl font-semibold">InvoiceSpace.</h3>
      <Button rounded label="Get in Touch." severity="secondary" />
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