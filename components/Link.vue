<template>
  <a :class="{ active: isActive }">
    <slot />
  </a>
</template>
<style>
a {
  --at-apply: text-sm font-sans font-300 py-1.5 px-3 rounded-1.5 hover:bg-gray-100 font-medium transition-all;
}
a.active {
  --at-apply: font-bold bg-gray-100;
}
</style>
<script lang="ts" setup>
const pageContext = usePageContext()
const { href } = <{ href: string }>useAttrs()

const isActive = computed(() => {
  const { urlPathname } = pageContext.value
  return href === '/' ? urlPathname === href : urlPathname.startsWith(href)
})
</script>
