<template>
  
  <MobileMenu class="bk-col-root" v-if="status == 'show'" />
  <div class="bk-col-min hidden" flex="sm:~ justify-center">
    <p
      class="text-xs tracking-tight text-gray-600 font-sans bg-gray-100 px-3 py-1 rounded-full"
    >
      Building Systems From Concept to Brilliance -
      <span class="font-semibold">Simple, Polished, Built to Last.</span>
    </p>
  </div>
  <div class="bk-col-max sm:my-3 relative">
    <!-- MENU -->
    <ul
      flex="sm:~ col items-center gap-x1 gap-y-2"
      sm="flex-row justify-center"
      class="hidden"
    >
      <li v-for="link in links" :key="link.name">
        <Link :href="link.path">{{ link.name }}</Link>
      </li>
    </ul>
    <!-- HAMBURGER MENU -->
    <Button
      icon="i-solar-hamburger-menu-outline text-xl"
      size="small"
      severity="secondary"
      pt:root="mb-4 sm:hidden! float-end absolute! top-0 right-0 p-2! z-1"
      @click="() => bus.emit('open')"
    />
  </div>
  <slot />
  <!-- FOOTER -->
  <footer class="bk-col-full mt-14">
    <p class="text-accent text-sm font-medium">
      Before code, before solutions — I listen.
    </p>
    <h3
      class="text-neutral-800 font-medium text-2xl leading-7 tracking-tighter mb-6"
    >
      Identifying the Problem — <br />
      <span class="text-neutral-500"
        >Honest communication and deep listening</span
      >
    </h3>

    <strong
      class="font-epilogue text-5xl text-neutral-800 tracking--.6 leading-12"
    >
      “The right solution begins with the right questions.”
    </strong>

    <div class="footer mt-20 space-y-2 mb-5" grid="~ justify-items-center">
      <div class="w-full max-w-125 border-3 b-accent b-b-0 h-3"></div>
      <div class="footer-divider"></div>
      <p class="text-sm font-medium text-center tracking-tight">
        No tech knowledge required <br />
        — I’ll walk you through everything you need.
      </p>
      <p
        class="font-epilogue text-neutral-800 text-2xl text-center font-medium tracking-tighter"
      >
        <a href="mailto:wills.yte50@gmail.com" text-2xl hover="text-accent"
          >[Let’s Work Together]</a
        >
        or
        <a
          href="https://api.whatsapp.com/send?phone=2349019381921"
          max-sm:block
          text-2xl
          hover="text-accent"
          >[Book a Call]</a
        >
      </p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const bus = useEventBus("mobile-menu");
const { status, links } = storeToRefs(useMobileMenu())

const MobileMenu = defineAsyncComponent(
  () => import("@/components/MobileMenu.vue")
);
</script>

<style lang="scss">
.footer-divider {
  background: linear-gradient(
    90deg,
    #fbfbfb 0% 0%,
    #e0e0e0 46.88% 46.88%,
    #fbfbfb 100% 100%
  );
  width: 100%;
  max-width: 128px;
  height: 2px;
}
</style>
