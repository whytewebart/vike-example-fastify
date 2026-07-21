<template>
	<main></main>
</template>

<script lang="ts" setup></script>

<style lang="scss">
main {
	background:
		radial-gradient(
			135.56% 62.93% at 1.32% 0%,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.33) 38%,
			rgba(255, 255, 255, 0.6) 39%,
			rgba(255, 255, 255, 0) 40%,
			rgba(255, 255, 255, 0) 43%,
			rgba(255, 255, 255, 0.49) 57%,
			rgba(214, 235, 255, 0.87) 74%,
			rgba(249, 249, 249, 0) 77%,
			rgba(255, 255, 255, 0.33) 81%,
			#fafafa 100%
		),
		conic-gradient(
			from 180deg at 50% 0%,
			#1780e3 0%,
			#79b5ed 56%,
			#167dde 96%
		);

	@screen sm {
		background:
			linear-gradient(
				133deg,
				rgba(255, 255, 255, 0) 0%,
				rgba(255, 255, 255, 0.33) 38%,
				rgba(255, 255, 255, 0.6) 39%,
				rgba(255, 255, 255, 0) 40%,
				rgba(255, 255, 255, 0) 43%,
				rgba(255, 255, 255, 0.49) 57%,
				rgba(214, 235, 255, 0.87) 74.26%,
				rgba(249, 249, 249, 0) 76.73%,
				rgba(255, 255, 255, 0.33) 81%,
				#ffffff 100%
			),
			radial-gradient(
				70.16% 118.53% at 50% 50.78%,
				rgba(211, 211, 242, 0) 35%,
				rgba(51, 64, 171, 0) 49%,
				rgba(255, 255, 255, 0.77) 51%,
				rgba(135, 129, 235, 0) 55%
			),
			radial-gradient(
				100% 88.74% at 50% 0%,
				#1780e3 0%,
				#79b5ed 56%,
				#167dde 96%
			);
	}

	@apply: min-h-screen-lg bk-col-root!;
}
</style>
