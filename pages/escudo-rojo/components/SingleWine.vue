<template>
  <div grid="~" hover="[&_h3]:text-red-6">
    <div flex="~ justify-between">
      <p class="text-sm">{{ props.wine.type }}</p>
      <p class="text-sm font-semibold text-neutral-800">
        {{ props.wine.age }}
      </p>
    </div>
    <div
      class="w-full h-78.75 bg-white my-2 p-4 relative overflow-hidden"
      ref="target"
    >
      <img
        :src="wine.image"
        alt=""
        class="w-full h-full object-contain z-1 relative"
      />

      <div
        class="absolute bottom-0 left-0 right-0 bg-red-600 h-0"
        :data-animate-key="props.wine.name"
        data-animate="alt-bg"
      ></div>
    </div>
    <h3
      class="font-[Instrument_Serif] font-semibold text-xl text-neutral-800 line-clamp-3 whitespace-nowrap"
    >
      {{ props.wine.name }}
    </h3>
    <p class="tracking-tight truncate-overview" ref="content">
      {{ props.wine.overview }}
    </p>
  </div>
</template>

<script lang="ts" setup>
interface Wine {
  type: string;
  name: string;
  age: string; // Represents the vintage year or range (e.g., "2021" or "2021 - 2023")
  overview: string;
  producer: string;
  region: string;
  grapes: string[]; // Array of grape varietals
  alcohol_content: string; // e.g., "13.5% - 14.5% ABV"
  food_pairings: string[]; // Array of suggested food pairings
  image: string; // URL path to the wine image
}

const props = defineProps<{ wine: Wine }>();

useGsap(({ gsap, defineKeys }) => {
  const keys = defineKeys(["visit-app", "alt-bg", "work-card-overview"])

  // Animate the visit-app button .01
  target.value.addEventListener("mouseenter", (e) => {
    const element = e.target as HTMLElement;
    const bg = target.value.querySelector(keys["alt-bg"]);

    gsap.to(bg, {
      height: "100%",
      duration: 0.5,
      ease: "power2.inOut",

      onComplete: () => {
        gsap.set(bg, {
          top: 0,
        });
      },
    });
  });

  // .02
  target.value.addEventListener("mouseleave", (e) => {
    const element = e.target as HTMLElement;
    const key = element.querySelector(keys["visit-app"]);
    const bg = target.value.querySelector(keys["alt-bg"]);

    gsap.to(bg, {
      top: "unset",
      height: 0,
    });
  });

  target.value
    .querySelector(keys["visit-app"])
    ?.addEventListener("click", (e) => {
      // e.preventDefault();

      const bg = target.value.querySelector(keys["alt-bg"]);
      const alternate_bgs = document.querySelectorAll(keys["alt-bg"]);
      const alternate_bgs_array = Object.values(alternate_bgs).filter(
        (d) =>
          d.getAttribute("data-animate-key") !==
          bg?.getAttribute("data-animate-key")
      );

      Promise.all([
        gsap.to(bg, {
          height: "100%",
          duration: 0.5,
          ease: "power2.inOut",

          onComplete: () => {
            gsap.set(bg, {
              top: 0,
            });
          },
        }),

        alternate_bgs_array.forEach((d) => {
          gsap.to(d, {
            top: "unset",
            height: 0,
          });
        }),
      ]);
    });
});

const target = templateRef<HTMLElement>("target", null);
const content = templateRef<HTMLElement>("content", null);
</script>

<style lang="scss">
.truncate-overview {
  @apply: tracking-tight line-clamp-3;
  transition: all 0.3s ease-in-out;
}

.visit-site-btn {
  background: url("assets/background-v2.png");
  background-size: 128px auto;
  @apply: bg-alabaster;
}
</style>
