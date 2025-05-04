<template>
  <div
    sm="bg-white p-2 rounded-5"
    grid="sm:~ cols-[minmax(0,_350px)_auto] items-start justify-between"
  >
    <div grid="~ sm:cols-[1fr_1.3fr] gap-y-4 gap-x-1.5">
      <div
        class="h-102px w-full rounded-4 bg-gray-100 profile-wrapper relative"
        max-sm="h-210px w-210px rounded-full order-1"
      >
        <!-- active-state -->
        <div
          class="w-4.5 h-4.5 rounded-full bg-#1773e3 border-2 border-solid border-white absolute top--1 left--1"
          max-sm="top-12 right-0 left-initial"
        ></div>

        <img
          src="assets/images/emmanuel-transparent-bg.webp"
          alt=""
          class="w-full h-full object-contain rounded-full"
        />
      </div>
      <div class="space-y-1.5">
        <h4
          class="font-epilogue tracking-tight sm:text-3.25 font-medium max-sm:max-w-55 leading-tight"
        >
          I help individuals and businesses build reliable apps and websites —
          with clarity, care, and long-term support.
        </h4>
        <Button
          label="About Myself"
          icon="i-solar-arrow-right-outline"
          icon-pos="right"
          severity="secondary"
          size="small"
          fluid
          pt:root="justify-between! max-sm:hidden!"
          as="a"
          href="/about"
        />
      </div>
    </div>
    <Button
      rounded
      icon="i-solar-link-outline"
      severity="secondary"
      as="a"
      href="mailto:wills.yte50@gmail.com"
    />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: true,
});
</script>

<style>
.profile-wrapper {
  background: conic-gradient(
    from 180deg at 50% 50%,
    #ffffff 0% 0%,
    #1773e3 100% 100%
  );
}
</style>
