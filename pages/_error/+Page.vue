<template>
  <div class="mt-8" grid="~ justify-items-center gap-y-4">
    <Button severity="secondary" size="small" class="bg-stone-200/50! capitalize hover:cursor-default">{{ abortReason }}</Button>
    <img src="./404.svg" alt="" class="w-full">
    <p class="text-center text-gray-5 max-w-sm">
      The page you are looking for does not exist or an error occurred. Try the links below.
    </p>

    <div grid="~ cols-3 gap-x-2">
      <Button severity="secondary" size="small" class="capitalize" v-tooltip="'Click to clear up authentication errors'">Home</Button>
      <Button severity="secondary" size="small" class="capitalize" v-tooltip.bottom="'Go to Dashboard'" as="a" href="mailto:wills.yte50@gmail.com">Let's Work Together</Button>
      <Button severity="secondary" size="small" class="capitalize" v-tooltip.left="'See your organizations'" as="a" href="/work">Portfolio '24</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const pageContext = usePageContext()
let { is404, abortReason } = pageContext.value
if (!abortReason) {
  abortReason = is404 ? 'Page not found.' : 'Something went wrong.'
}
</script>

<style>

</style>
