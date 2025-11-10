<template>
  <div class="max-w-sm py-4 h-dvh max-h-screen-xl sticky top-0" grid="~ content-between">
    <ul>
      <template v-for="{ href, text } in links">
        <li>
          <Link :href="href">{{ text }}</Link>
        </li>
      </template>
    </ul>

    <div class="font-mono space-y-5xl">
      <img src="/logo.svg" alt="" />

      <div flex="~ items-end justify-between">
        <div>
          <p>Quick-Step Biolerplate</p>
          <p>Whyte WebArt Studios</p>
        </div>

        <p mr-4>{{ currentPage?.text }}</p>
      </div>
    </div>
  </div>

  <slot />
</template>

<script lang="ts" setup>
import { getGlobalContext } from "vike";

const pageContext = usePageContext();
console.log(pageContext.value.globalContext);
// const globalContext = await getGlobalContext()

const currentPage = computed(() => {
  const pages = pageContext.value.globalContext.pages;
  const pageId = pageContext.value.pageId!;
  const { route, ...select } = pages[pageId];

  return links.find((link) => link.href === route);
});

const links = reactive([
  {
    href: "/",
    text: "Index",
    children: [
      { href: "/#", text: "State Management" },
      { href: "/#", text: "Unhead SEO" },
      { href: "/#", text: "UnoCSS + Preset" },
      { href: "/#", text: "Serverless" },
      { href: "/#", text: "TSX Support" },
      { href: "/#", text: "Fastify" },
    ],
  },
  { href: "/#", text: "State Management" },
  { href: "/#", text: "Unhead SEO" },
  { href: "/#", text: "UnoCSS + Preset" },
  { href: "/#", text: "Serverless" },
  { href: "/#", text: "TSX Support" },
  { href: "/#", text: "Fastify" },
]);
</script>

<style lang="scss">
body {
  --at-apply: bg-stone-100;
  #view--content {
    --at-apply: min-h-screen;
  }
}

#view--container {
  --at-apply: viewport;
  #view--content {
    --at-apply: bk-col-nav grid grid-cols-[auto_1fr] grid-items-start;
  }
}
</style>

<style lang="scss" scoped>
ul {
  --at-apply: flex gap-x-4 gap-y-.7 flex-wrap;
  li > a {
    --at-apply: font-mono text-base text-gray-400 transition transition-ease-in-out duration-400;
    --at-apply: hover:text-gray-700;
  }

  &:has(li:hover) {
    li:not(:hover) a {
      --at-apply: opacity-50 text-gray-400;
    }
  }

  li {
    --at-apply: transition-all flex;
    .router-link-active {
      --at-apply: text-gray-700 font-semibold;
      --at-apply: before:content-['•_'];
    }
  }
}
</style>
