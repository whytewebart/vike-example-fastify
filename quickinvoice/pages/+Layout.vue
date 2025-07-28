<template>
  <div class="quickinvoice">
    <header
      class="bk-col-full py-2 px-2 bg-white m-4 rounded-lg"
      flex="~ items-center justify-between wrap"
      sm="mx-0"
    >
      <img src="../assets/invoicespace.brandmark.svg" width="60" alt="" />

      <nav flex="~ items-center gap-2 wrap">
        <Button icon="i-heroicons-arrow-uturn-left-solid" pt:root="flex! py-1.5!" severity="secondary" size="small" href="/" as="a" />
        <Button label="Share Your Thoughts" severity="secondary" size="small" pt:root="hidden! sm:flex!" />
        <Button label="Work With Me" size="small" icon-pos="right" icon="i-solar-arrow-right-outline" />
      </nav>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
// html,
body:has(.quickinvoice) {
  --at-apply: app-scrollbar;

  &::-webkit-scrollbar-track {
    --at-apply: bg-gray-200;
  }

  &::-webkit-scrollbar-button {
    --at-apply: bg-red;
  }

  #view-content {
    all: unset;
  }
  :not(:defined) {
    visibility: hidden;
  }

  .quickinvoice {
    --at-apply: viewport;
    --at-apply: [--full-val:_1200px_!important];
    --gap: 0em
  }
}
</style>
