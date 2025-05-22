<template>
  <header
    flex="~ items-center justify-between"
    class="p-5 relative overflow-x-clip"
    ref="headerEl"
    v-gsap:header-el
  >
    <nav>
      <ul flex="~ items-center">
        <li class="xmd:hidden">
          <Button
            icon="i-solar-hamburger-menu-outline text-3xl!"
            pt:root="p0!"
            text
            @click="() => bus.emit('open')"
          />
        </li>

        <ul class="hidden xmd:flex flex-items-center">
          <template v-for="(singleLink, label) in links">
            <li class="[&_a]:first:pl-0">
              <Link
                href="#"
                class="text-red-500"
                hover="text-red-600 cursor-pointer"
                >{{ label }}</Link
              >
            </li>

            <li last:hidden><i v-html="starSvg"></i></li>
          </template>
        </ul>
      </ul>
    </nav>

    <div
      v-gsap:logo-el
      class="xmd:absolute right-50% left-50% hover:cursor-pointer z-10"
    >
      <span
        v-html="escudoRojoLogo"
        xmd="w-27 p-3 rounded-full opacity-0"
        class="*:w-20 *:h-a block hover:bg-red-100! transition-all"
        border="transparent xmd:red-200"
      ></span>
    </div>

    <nav class="hidden xmd:flex flex-items-center">
      <ul flex="~ items-center">
        <template v-for="(singleLink, label) in socialMedia">
          <li>
            <Link class="text-red-500" hover="text-red-600 cursor-pointer">{{
              label
            }}</Link>
          </li>

          <li last:hidden><i v-html="starSvg"></i></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import starSvg from "../assets/star.svg?raw";
import escudoRojoLogo from "../assets/escudo-rojo-logo.svg?raw";

const bus = useEventBus("mobile-menu");

const links = {
  "The Worthy Heir": {
    key: "worthy-heir",
    path: "/",
    nested: {
      "Baron Philippe De Rothschild in Chile": "/",
      "Escudo Rojo": "/",
      Expertise: "/",
    },
  },
  "The Sustainable Development": {
    key: "sustainable-development",
    path: "/",
    nested: {
      "Remarkable Terroir": "/",
      "Sustainable Development Policy": "/",
      Commitments: "/",
      "Enery Policy": "/",
      Cetification: "/",
      "Moderate Drinking": "/",
    },
  },
  "Our Wines": {
    key: "our-wines",
    path: "/",
    nested: {
      "Baronesa P.": "/",
      "Baronesa P. - The Vintages": "/",
      "Escudo Rojo Origine": "/",
      "Escudo Rojo Gran Reserva": "/",
      "Escudo Rojo Gran Reserva Varientals": "/",
    },
  },
};

const socialMedia = {
  "Photo Gallery": "/",
  Instagram: "/",
  Facebook: "/",
};

const { x, y } = useMouse();
const headerEl = ref<HTMLElement>();

useGsapTimeline(["header-el", "logo-el"], {}, ({ elements, gsap }) => {
  const logoEl = document.querySelector(elements["logo-el"]);
  const headerEl = document.querySelector(elements["header-el"]);
  const logoElSpan = document.querySelector(elements["logo-el"] + " span");

  gsap.to(elements["logo-el"] + " span", {
    backgroundColor: "#F8F8F8",
    opacity: 1,
    onComplete: () => {
      gsap.to(logoEl, {
        top: "40px",
      });
    },
  });

  // bg-alabaster
  headerEl?.addEventListener("mousemove", (e) => {
    let [xValue, yValue] = [x.value + 10, y.value - 10];

    gsap.to(elements["logo-el"] + " span", {
      backgroundColor: "#F8F8F8",
      border: 1,
      opacity: 1,
    });

    gsap.to(logoEl, {
      left: xValue + "px",
      top: yValue + "px",
      delay: 0.2,
    });
  });
});
</script>

<style></style>
