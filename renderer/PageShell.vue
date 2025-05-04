<script lang="ts" setup>
const showSpinner = ref(false);
const bus = useEventBus<string>("spinner");

bus.on((event) => {
  if (event === "stop-spinner") {
    showSpinner.value = false;
  } else if (event === "start-spinner") {
    showSpinner.value = true;
  }
});
</script>

<template>
  <div id="view-container">
    <ProgressBar
      mode="indeterminate"
      style="height: 6px"
      v-if="showSpinner"
      class="bk-col-root fixed! top-0 left-0 right-0 z-10"
      pt:value="bg-accent!"
      pt:root="h-.8!"
    />
    <div id="view-content" class="viewport h-full py-5">
      <slot />
    </div>

    <!-- <img src="assets/background.webp" class="w-full h-full object-cover absolute top-0 right-0 left-0 opacity-40 md:opacity-10" alt=""> -->
  </div>
</template>

<style lang="scss">
body {
 background: url("assets/background-v2.png");
 background-size: 128px auto;
 @apply: bg-alabaster;
}
</style>
