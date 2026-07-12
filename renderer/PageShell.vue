<script lang="ts" setup>
</script>

<template>
  <div viewport="all">
    <div viewport="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
body {
	--at-apply: bg-stone-100;
	[viewport="content"] {
		--at-apply: min-h-screen;
	}
}

[viewport="all"] {
	[viewport="content"] {
	--at-apply: viewport;
	}
}
</style>
