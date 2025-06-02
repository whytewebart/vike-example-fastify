<template>
  <div class="bk-col-min hidden" flex="sm:~ justify-center items-center">
    <a href="/" class="[all:unset] cursor-pointer" title="Home">
      <img
        data-animate="application-brandmark"
        src="/brandmark.png"
        width="20px"
        alt=""
        mr-2
      />
    </a>
    <p
      class="text-xs tracking-tight text-gray-600 font-sans bg-gray-100 px-3 py-1 rounded-full overflow-clip"
    >
      <span>
        Building Systems From Concept to Brilliance -
        <span class="font-semibold"
          >Simple, Polished, Built to Last.</span
        ></span
      >
    </p>
  </div>
</template>

<script lang="ts" setup>
useGsap(({ gsap, defineKeys }) => {
  const elements = defineKeys(["application-brandmark"]);
  const key = elements["application-brandmark"];

  const htmlElement = document.querySelector(key);
  htmlElement?.addEventListener("mouseenter", (e) => {
    gsap.to(key, {
      scale: 1.5,
      rotate: 360,
      duration: 0.3,
    });
  });

  htmlElement?.addEventListener("mouseleave", (e) => {
    gsap.to(key, {
      scale: 1,
      duration: 0.3,
      rotate: 0,
    });
  });
});
</script>

<style></style>
