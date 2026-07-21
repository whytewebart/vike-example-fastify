<script lang="ts" setup></script>

<template>
	<div viewport="all">
		<div viewport="content">
			<slot />
		</div>
	</div>
</template>

<style lang="scss">
.body-bg {
	@apply: bg-stone-100 lg:bg-alabaster;
	&::before {
		background: url("assets/block.png");
		background-size: 128px auto;

		@apply: content-empty absolute top-0 left-0 w-full h-full z--1 opacity-50 lg:opacity-30;
	}
}

body {
	@apply: relative isolate;
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
