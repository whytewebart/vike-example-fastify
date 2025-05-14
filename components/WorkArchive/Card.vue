<template>
  <div grid="~" hover="[&_h3]:text-accent">
    <div flex="~ justify-between">
      <p class="text-sm">{{ data.projectType }}</p>
      <p class="text-sm font-semibold text-neutral-800">
        {{ publishedDate }}
      </p>
    </div>
    <div
      class="w-full h-78.75 bg-blue-6 my-2 p-4 relative overflow-hidden"
      ref="target"
    >
      <img
        :src="data.thumbnail.url"
        alt=""
        class="w-full h-full object-contain z-1 relative"
      />

      <Button
        rounded
        icon="i-solar-link-outline"
        severity="secondary"
        pt:root="bg-gray-200! bg-opacity-60! hover:bg-opacity-100! b-0! opacity-0 z-2 absolute! left-50% translate--50%"
        pt:label="font-eb-garamond whitespace-nowrap"
        as="a"
        :href="data.url"
        class=""
        size="large"
        label="Visit Application"
        data-animate="visit-app"
      />

      <div
        class="absolute bottom-0 left-0 right-0 bg-gray-100 h-0"
        :data-animate-key="data.url"
        data-animate="alt-bg"
      ></div>
    </div>
    <h3
      class="font-medium text-xl text-neutral-800 tracking-tighter"
      hover="[&_span]:w-4 [&_span]:mr-2"
    >
      <a
        :href="data.url"
        class="[all:unset] flex bg-transparent! items-center cursor-pointer"
      >
        <!-- <span class="i-solar-link-bold w-0"></span> -->
        {{ data.client }}
      </a>
    </h3>
    <p class="tracking-tight truncate-overview" ref="content">
      {{ data.overview }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  client: Record<string, any>;
}>();

useGsapTimeline(["visit-app", "alt-bg", "work-card-overview"], {}, (ctx) => {
  const { gsap, elements: keys, timeline } = ctx;

  // Animate the visit-app button .01
  target.value.addEventListener("mouseenter", (e) => {
    const element = e.target as HTMLElement;
    const key = element.querySelector(keys["visit-app"]);

    gsap.to(key, {
      top: "50%",
      opacity: 1,
      duration: 0.3,
    });
  });

  // .02
  target.value.addEventListener("mouseleave", (e) => {
    const element = e.target as HTMLElement;
    const key = element.querySelector(keys["visit-app"]);

    gsap.to(key, {
      top: "100%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {},
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

  content.value.addEventListener("mouseenter", (e) => {
    const key = e.target as HTMLElement;

    timeline.play("reveal");

    timeline.from(
      key,
      {
        height: key.offsetHeight,
        duration: 0.3,
      },
      "reveal"
    );

    timeline.to(
      key,
      {
        display: "block",
        height: "100%",
        duration: 0.3,
        ease: "power2.inOut",
      },
      "reveal"
    );
  });

  content.value.addEventListener("mouseleave", (e) => {
    const key = e.target as HTMLElement;
    timeline.reverse();
  });
});

const data = toRef(() => props.client.data);
const target = templateRef<HTMLElement>("target", null);
const content = templateRef<HTMLElement>("content", null);
const publishedDate = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  year: "numeric",
}).format(new Date(data.value.published));
</script>

<style lang="scss">
.truncate-overview {
  @apply: tracking-tight line-clamp-3;
  transition: all 0.3s ease-in-out;
}
</style>
