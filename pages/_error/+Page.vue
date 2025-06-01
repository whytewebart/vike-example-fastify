<template>
  <div class="w-full sm:hidden" flex="~ justify-center">
    <a href="/" class="[all:unset]">
      <img
        src="/brandmark.png"
        width="100px"
        alt=""
        v-animate-key:error-application-brandmark
      />
    </a>
  </div>

  <div class="mt-8" grid="~ justify-items-center gap-y-4">
    <Button
      severity="secondary"
      size="small"
      class="bg-stone-200/50! capitalize hover:cursor-default"
      >{{ abortReason }}</Button
    >
    <img :src="is404 ? notFound : wentWrong" alt="" class="w-full" />
    <p class="text-center text-gray-5 max-w-sm">
      The page you are looking for does not exist or an error occurred. Try the
      links below.
    </p>

    <div grid="~ cols-3 gap-x-2">
      <Button severity="secondary" size="small" class="capitalize">Home</Button>
      <Button
        severity="secondary"
        size="small"
        class="capitalize"
        as="a"
        href="mailto:wills.yte50@gmail.com"
        >Let's Work Together</Button
      >
      <Button
        severity="secondary"
        size="small"
        class="capitalize"
        as="a"
        href="/work"
        >Portfolio '24</Button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import notFound from "./404.svg";
import wentWrong from "./500.svg";

const pageContext = usePageContext();
let { is404, abortReason } = pageContext.value;
if (!abortReason) {
  abortReason = is404 ? "Page not found." : "Something went wrong.";
}

useGsap(({ gsap, elementKey }) => {
  const key = elementKey("error-application-brandmark");
  
  document.querySelector(key)?.addEventListener("mouseenter", (e) => {
    gsap.to(key, {
      // scale: 1.5,
      rotate: 360,
      duration: 0.5,
    });
  });

  document.querySelector(key)?.addEventListener("mouseleave", (e) => {
    gsap.to(key, {
      // scale: 1,
      duration: 0.5,
      rotate: 0,
    });
  });
});
</script>

<style></style>
