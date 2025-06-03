<template>
  <div
    w-full
    overflow-y-auto
    scroll-smooth
    v-animate-key:mobile-menu
  >
    <div
      class="min-h-full bg-accent pt-30 pb-4"
      grid="~ rows-[auto_auto] gap-y-4 content-between"
    >
      <!-- HAMBURGER MENU -->
      <Button
        icon="i-heroicons-x-mark-solid text-xl"
        size="small"
        severity="secondary"
        pt:root="mb-4 float-end fixed! top-4 right-4 bg-white! rounded-full!"
        @click="() => toggle('close')"
      />

      <ul class="px-4" flex="~ col gap-y-2">
        <li v-for="link in links" :key="link.name">
          <Link
            :href="link.path"
            class="text-2xl font-semibold! tracking-tight text-alabaster/70 bg-transparent! font-urbanist transition-all rounded-lg"
            flex="~ items-center justify-between gap-x-2"
            hover="bg-gray-50/50! cursor-pointer text-white!"
          >
            <span>{{ link.name }}</span>
            <Button
              icon="i-heroicons-arrow-right-solid"
              text
              pt:icon="text-l text-white"
            />
          </Link>
        </li>
      </ul>

      <div class="px-4 space-y-2">
        <Button
          label="Start Project"
          severity="secondary"
          size="large"
          pt:label="text-2xl font-medium! tracking-tighter text-accent font-epilogue"
          pt:root="bg-white! rounded-xl!"
          fluid
          as="a"
          href="mailto:wills.yte50@gmail.com"
        />
        <Button
          label="Troubleshoot My App"
          severity="secondary"
          size="large"
          pt:label="text-2xl font-medium! tracking-tighter text-white font-epilogue"
          pt:root="bg-white/50! rounded-xl! b-none!"
          fluid
          as="a"
          href="https://api.whatsapp.com/send?phone=2349019381921"
        />
      </div>
    </div>
    <div class="py-2 text-center bg-alabaster" id="tagline">
      <span
        class="font-epilogue text-neutral-900 text-sm tracking-tight font-medium"
        >“Big ideas start small.”</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
const { links, toggle } = useMobileMenu();
const key = elementKey("mobile-menu");

useGsap(({ gsap }) => {
  // HIDE BODY SCROLL
  const body = document.querySelector("body") as HTMLBodyElement;
  const mobileMenu = document.querySelector(key) as HTMLDivElement;
  
  gsap.set(key, {
    height: 0,
    // marginTop: '-1.25rem'
  });

  gsap.to(key, {
    height: "100dvh",
    marginBottom: '2rem',
    duration: 1,
    ease: "power4.inOut",
    onComplete: () => {
      body.classList.add("overflow-hidden");
      gsap.to(key, {
        scrollTo: {
          y: mobileMenu.scrollHeight,
          autoKill: true,
        },
        duration: 1.2,
        ease: "power2.inOut"
      });
    },
  });
}, {
  plugins: ['ScrollToPlugin']
});
</script>

<style lang="scss">
/* #tagline {
  box-shadow: inset 0px 10px 18px -14px #00000080;
} */

[data-animate="mobile-menu"]::-webkit-scrollbar {
  width: 0px;
}

#view-content:not(:has(.escudo-rojo)) {
  & > [data-animate="mobile-menu"] {
    @apply: mt--5;
  }
}

</style>
