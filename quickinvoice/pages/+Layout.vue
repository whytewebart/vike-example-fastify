<template>
  <Toast />
  <ConfirmDialog
    :pt="{
      header: 'py-2 px-3 hidden!',
      headerActions: 'hidden!',
      root: 'p-0! bg-transparent!',
      content: 'bg-gray-50 px-4! py-2! rounded-t-lg!',
      icon: 'hidden',
      message: 'font-urbanist! text-sm text-gray-700',
      footer: 'bg-gray-50 p-2! rounded-b-lg! grid! grid-cols-2 gap-2',
      mask: 'bg-surface-50/20! backdrop-blur-sm!',
    }"
  >
    <template #message="{ message }">
      <span v-html="message.message"></span>
    </template>
  </ConfirmDialog>

  <div class="quickinvoice">
    <header
      class="py-2 px-2 bg-white my-4 mx-8 rounded-lg mt-12"
      flex="~ items-center justify-between wrap"
      sm="mx-0 mt-16"
    >
      <img src="../assets/invoicespace.brandmark.svg" width="60" alt="" />

      <nav flex="~ items-center gap-2 wrap">
        <Button
          icon="i-heroicons-arrow-uturn-left-solid"
          pt:root="flex! py-1.5!"
          severity="secondary"
          size="small"
          href="/"
          as="a"
        />
        <Button
          label="Share Your Thoughts"
          severity="secondary"
          size="small"
          pt:root="hidden! sm:flex!"
          as="a"
          href="mailto:wills.yte50@gmail.com"
        />
        <Button
          label="Work With Me"
          size="small"
          icon-pos="right"
          icon="i-solar-arrow-right-outline"
          as="a"
          href="mailto:whytewebart@gmail.com"
        />
      </nav>
    </header>
    <h1 class="font-epilogue sm:font-400 text-primary-800">
      Simple, Professional <br />
      <span>[ Invoicing for Creatives ]</span> <br />
      and Small Teams
    </h1>
    <p
      class="font-sans text-smp text-center max-w-sm mx-a font-normal tracking-tight"
    >
      Built to help freelancers, designers, and small businesses send branded
      invoices fast — without the clutter.
    </p>
    <div class="spacer my-5"></div>
    <slot />
  </div>

  <!-- <div
    id="follow-cursor"
    class="h-30 w-30 bg-primary-600 absolute -z-10 translate--50% rounded-full cursor-pointer no-scrollbar"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div> -->
  <div id="jump-to-editor" class="fixed bottom-4 right-4 z-10 space-x-2">
    <Button
      pt:root="py-1.5!"
      size="small"
      icon="i-solar-arrow-up-outline"
      @click="scrollToTop"
    />
    <Button
      label="Jump to Editor"
      size="small"
      icon="i-solar-arrow-down-outline"
      icon-pos="right"
      @click="scrollToEditor"
    />
  </div>
</template>

<script lang="ts" setup>
import gsap from "gsap";
import "@sjmc11/tourguidejs/src/scss/tour.scss";

function scrollToEditor() {
  document.querySelector("editor-wrapper")?.scrollIntoView({
    behavior: "smooth",
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  const _target = <HTMLElement>document.querySelector("editor-wrapper")!;
  const target = <HTMLElement>document.querySelector("#jump-to-editor")!;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(target, {
            height: 0,
            overflow: "hidden",
          });

          // bus.emit('open-editor')
        } else {
          gsap.to(target, {
            height: "auto",
          });
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(_target);
});
</script>

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
    --gap: 1em;
    --full-val: 1200px;

    h1 {
      // font-size: clamp(40px, 5vw, 60px);
      font-size: clamp(30px, 12vw - 1rem, 60px);
      letter-spacing: -0.09em;
      line-height: 1;
      text-align: center;
      grid-column: max !important;

      @screen xs {
        font-size: clamp(30px, 5vw + 1rem, 60px);
      }
    }
  }

  @screen lt-md {
    background: #f4f4f5 !important;
  }
}
</style>
