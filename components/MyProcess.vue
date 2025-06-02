<template>
  <div>
    <div flex="~ items-center justify-between" class="mt-9">
      <h3 class="font-medium tracking-tight text-2xl text-neutral-800">
        🔁 My Process
      </h3>
      <Button
        :label="processSteps == 0 ? '[Expand]' : '[Collapse]'"
        text
        size="small"
        severity="contrast"
        pt:label="font-bold"
        @click="toggleProcessSteps"
      />
    </div>

    <!-- MY PROCESS GRID -->
    <div class="process-grid transition-all" v-show="processSteps == 1">
      <div>
        <img src="assets/process/communicate.webp" loading="lazy" decoding="async" />
        <span>1</span>
      </div>
      <div>
        <img src="assets/process/identify.webp" loading="lazy" decoding="async" />
        <span>2</span>
      </div>
      <div>
        <img src="assets/process/troubleshoot.webp" loading="lazy" decoding="async" />
        <span>3</span>
      </div>

      <div>
        <img src="assets/process/listen.webp" loading="lazy" decoding="async" />
        <span>4</span>
      </div>
      <div>
        <img src="assets/process/breakdown.webp" loading="lazy" decoding="async" />
        <span>5</span>
      </div>

      <div>
        <img src="assets/process/simplify.webp" loading="lazy" decoding="async" />
        <span>6</span>
      </div>
      <div>
        <img src="assets/process/revert.webp" loading="lazy" decoding="async" />
        <span>7</span>
      </div>
      <div>
        <img src="assets/process/complete-and-polish.webp" loading="lazy" decoding="async" />
        <span>8</span>
      </div>
    </div>

    <div class="mt-6">
      <h4 class="text-neutral-800 process-steps-text -tracking-.4 font-medium">
        Communicate → Identify →
        <span class="text-blue-700">Troubleshoot</span> <br />
        Listen → Break Down → <span class="text-blue-700">Simplify</span> <br />
        Revert if needed → <span class="text-blue-700">Complete & Polish</span>
        <br />
      </h4>
    </div>
  </div>
</template>

<script lang="ts" setup>
// TOGGLE PROCESS STEPS
const processSteps = ref<0 | 1>(0);
const toggleProcessSteps = () =>
  (processSteps.value = processSteps.value === 0 ? 1 : 0);

defineExpose({
    status: computed(() => processSteps.value === 0 ? 'open' : 'closed')
})
</script>

<style lang="scss">
.process-grid {
  --at-apply: [&>div]:bg-gray-100 h-170 md:h-60 text-lg mt-6 grid grid-cols-2 grid-rows-19 md:grid-rows-12 md:grid-cols-5 gap-2;

  & > div {
    --at-apply: relative bg-gray-200 overflow-hidden;

    &:nth-of-type(1) {
      --at-apply: col-start-1 row-start-1 row-span-9 md:row-span-12;
    }

    &:nth-of-type(2) {
      --at-apply: col-start-2 row-start-1 row-end-5 md:row-end-6;
    }

    &:nth-of-type(3) {
      --at-apply: col-start-2 row-start-5 row-end-10 md:row-start-6 md:row-end-13;
    }

    &:nth-of-type(4) {
      --at-apply: col-start-1 row-start-10 row-end-15 md:col-start-3 md:row-start-1 md:row-end-8;
    }

    &:nth-of-type(5) {
      --at-apply: col-start-2 row-start-10 row-end-15 md:col-start-3 md:row-start-8 md:row-end-13;
    }

    &:nth-of-type(6) {
      --at-apply: col-start-1 row-span-19 md:col-start-4 md:row-span-12;
    }

    &:nth-of-type(7) {
      --at-apply: col-start-2 row-start-15 row-end-19 md:col-start-5 md:row-start-1 md:row-end-7;
    }

    &:nth-of-type(8) {
      --at-apply: col-start-2 row-start-19 row-end-34 md:col-start-5 md:row-start-7 md:row-end-13;
    }

    span {
      font-weight: 600;
      --at-apply: bg-gray- block w-fit rounded-full px-4 py-2 absolute top-0 left-0 z-1 text-white;
    }

    img {
      --at-apply: w-full h-full object-cover;
    }
  }
}

.process-steps-text {
  font-size: clamp(1.5rem, 1rem + 0.5vw, 1.5rem);
  line-height: 1.25em;
  /* 28px */
}
</style>
