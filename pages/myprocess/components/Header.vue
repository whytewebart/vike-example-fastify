<template>
  <div class="bk-col-min hidden z-1" flex="sm:~ justify-center items-center">
    <a href="/" class="[all:unset] cursor-pointer mr-2" title="Home">
      <img
        data-animate="application-brandmark"
        src="/brandmark.png"
        width="20px"
        alt=""
      />
    </a>
    <p
      class="text-xs tracking-tight text-gray-50 font-sans bg-gray-100/20 px-3 py-1 rounded-full"
    >
      Building Systems From Concept to Brilliance -
      <span class="font-semibold">Simple, Polished, Built to Last.</span>
    </p>
  </div>
  <div class="bk-col-max sm:my-3 relative z-10">
    <!-- MENU -->
    <ul
      flex="sm:~ col items-center gap-x1 gap-y-2"
      sm="flex-row justify-center"
      class="hidden [&_.active]:text-black"
    >
      <li v-for="link in links" :key="link.name">
        <Link
          :href="link.path"
          class="text-white hover:bg-white/30 hover:text-white"
          >{{ link.name }}</Link
        >
      </li>
    </ul>
    <!-- HAMBURGER MENU -->
    <Button
      icon="i-solar-hamburger-menu-outline text-xl"
      size="small"
      severity="secondary"
      pt:root="mb-4 sm:hidden! float-end absolute! top-0 right-0 p-2!"
      @click="() => bus.emit('open')"
      title="menu dropdown"
    />
  </div>
</template>

<script lang="ts" setup>
const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Work Process",
    path: "/myprocess",
  },
  {
    name: "Portfolio / Case Studies",
    path: "/work",
  },
];

const hideModal = ref(true);
const bus = useEventBus<string>("mobile-menu");
bus.on((event) => {
  if (event === "close") {
    hideModal.value = true;
  } else if (event === "open") {
    hideModal.value = false;
  }
});

useGsap(({ gsap, elementKey }) => {
  const key = elementKey("application-brandmark");
  document.querySelector(key)?.addEventListener("mouseenter", (e) => {
    gsap.to(key, {
      scale: 1.5,
      rotate: 360,
      duration: 0.3,
    });
  });

  document.querySelector(key)?.addEventListener("mouseleave", (e) => {
    gsap.to(key, {
      scale: 1,
      duration: 0.3,
      rotate: 0,
    });
  });
});
</script>
