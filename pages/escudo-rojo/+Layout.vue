<template>
  <div class="bk-col-root escudo-rojo">
    <Header />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue';
// import "./assets/main.scss"

</script>

<style lang="scss">
.font-instrument-serif {
  font-family: "Instrument Serif", serif;
}

.font-instrument-sans {
  font-family: "Instrument Sans", serif;
}

#view-content:has(.escudo-rojo) {
  @apply: p-0;
}

</style>