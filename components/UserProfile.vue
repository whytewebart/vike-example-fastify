<template>
  <div
    sm="bg-white p-2 rounded-5"
    grid="sm:~ cols-[minmax(0,_350px)_auto] items-start justify-between"
  >
    <div grid="~ sm:cols-[1fr_1.3fr] gap-y-4 gap-x-1.5" overflow-clip>
      <div
        class="h-102px w-full rounded-4 bg-gray-100 profile-wrapper relative"
        max-sm="h-210px w-210px rounded-full order-1"
        v-motion="{
          initial: {
            background:
              'conic-gradient(from 0deg at 50% 50%, #ffffff 0% 0%, #1773e3 100% 100%)',
            transition: {
              duration: 400,
              ease: 'easeInOut',
            },
          },
          enter: {
            background:
              'conic-gradient(from 180deg at 50% 50%, #ffffff 0% 0%, #1773e3 100% 100%)',
            transition: {
              duration: 400,
              ease: 'easeInOut',
            },
          },
        }"
      >
        <!-- active-state -->
        <div
          class="w-4.5 h-4.5 rounded-full bg-#1773e3 border-2 border-solid border-white absolute top--1 left--1 hidden"
          max-sm="top-12 right-0 left-initial"
        ></div>

        <div class="m-3 h-[-webkit-fill-available] rounded-full bg-white/50 absolute top-0 right-0 left-0">
        </div>

        <img
          src="assets/images/emmanuel-transparent-bg.webp"
          v-if="ctx.urlOriginal == '/about'"
          alt=""
          class="w-full h-full object-contain rounded-full"
          v-motion="{
            initial: {
              opacity: 0,
              y: '100%',
            },
            enter: {
              opacity: 1,
              y: '0%',
              transition: { duration: 500, ease: 'easeInOut' },
            },
          }"
        />
      </div>
      <div class="space-y-1.5">
        <h4
          class="font-epilogue tracking-tight sm:text-3.25 font-medium max-sm:max-w-55 leading-tight"
          v-gsap:aboutMe
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
    <div flex="~ gap-2" max-sm="mt-2">
      <Button
        rounded
        icon="i-solar-link-outline"
        severity="secondary"
        as="a"
        href="mailto:wills.yte50@gmail.com"
        size="large"
        class="grid!"
      />

      <Button
        rounded
        severity="secondary"
        text
        as="a"
        label="Let's Connect"
        pt:root="sm:hidden"
        href="https://www.upwork.com/freelancers/~01d2c9b0fd4909e526?mp_source=share"
        target="_blank"
        v-if="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

const ctx = usePageContext()

defineOptions({
  inheritAttrs: true,
});
</script>

<style>
.profile-wrapper {
  --deg: 0deg;
  background: conic-gradient(
    from var(--deg) at 50% 50%,
    #ffffff 0% 0%,
    #1773e3 100% 100%
  );
}
</style>
