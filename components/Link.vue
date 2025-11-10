<template>
  <a :class="{ 'router-link-active': isActive }">
    <slot />
  </a>
</template>
<style scoped>
</style>
<script lang="ts" setup>
import { useAttrs, computed } from 'vue'

const pageContext = usePageContext()
const { href } = useAttrs() as { href: string }
const isActive = computed(() => {
  const { urlPathname } = pageContext.value
  return href === '/' ? urlPathname === href : urlPathname.startsWith(href)
})
</script>
