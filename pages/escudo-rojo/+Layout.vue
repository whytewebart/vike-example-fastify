<template>
  <Header />
  <slot />
</template>

<script lang="ts" setup>
import Header from './components/Header.vue';
</script>

<style lang="scss">
.font-instrument-serif {
  font-family: "Instrument Serif", serif;
}

.font-instrument-sans {
  font-family: "Instrument Sans", serif;
}

#view-content:has(.escudo-rojo) {
  @apply: p-0 bk-content-1440;
}

</style>