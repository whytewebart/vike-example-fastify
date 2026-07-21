<template>
	<div class="marquee-container bk-col-root!">

	<div class="marquee-wrap">
		<div class="band top">
			<div class="track" id="track-top">
				<template v-for="item in [...marquee, ...marquee]" :key="item">
					<span>{{ item }}</span>
					<svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.5 0L41.5709 18.8205L58.319 8.30542L50.872 26.625L70.4607 29.3355L52.9803 38.5823L66.2439 53.25L46.9095 49.0973L47.6417 68.8591L35.5 53.25L23.3583 68.8591L24.0905 49.0973L4.7561 53.25L18.0197 38.5823L0.539326 29.3355L20.128 26.625L12.681 8.30542L29.4291 18.8205L35.5 0Z" fill="#1780E3" fill-rule="evenodd" />
					</svg>
				</template>
			</div>
		</div>
		<div class="band bottom">
			<div class="track" id="track-bottom">
				<template v-for="item in [...marquee, ...marquee].reverse()" :key="item">
					<span>{{ item }}</span>
					<svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.5 0L41.5709 18.8205L58.319 8.30542L50.872 26.625L70.4607 29.3355L52.9803 38.5823L66.2439 53.25L46.9095 49.0973L47.6417 68.8591L35.5 53.25L23.3583 68.8591L24.0905 49.0973L4.7561 53.25L18.0197 38.5823L0.539326 29.3355L20.128 26.625L12.681 8.30542L29.4291 18.8205L35.5 0Z" fill="#1780E3" fill-rule="evenodd" />
					</svg>
				</template>
			</div>
		</div>
	</div>
	</div>
</template>

<script setup lang="ts">
const marquee = [
	"Email Development",
	"Containerization",
	"AI/ML",
	"Cloud Computing",
	"Search Engine Optimization",
	"Webflow",
	"Wix Studio",
	"WordPress",
	"WebHooks",
	"SSL & Domain Configuration",
	"Monitoring & Logging",
];
</script>

<style lang="scss">

.marquee-container {
	@apply: -mt-8 lg:-mt-14;
}

.marquee-wrap {
	@apply: flex items-center justify-center py-15 lg:py-20;
	@apply: relative w-full overflow-hidden;
	/*@apply: border border-neutral-300;*/
}
.band {
	@apply: absolute left--10% w-120%;
	@apply: flex items-center overflow-hidden;
	@apply: py-3 border border-neutral-200 bg-white;

	@apply: top-50% translate-y--50%;

	&.top { @apply: rotate--7 sm:rotate--4; }
	&.bottom { @apply: rotate-7 sm:rotate-4; }

	&.top .track { animation: scroll-left 40s linear infinite; }
	&.bottom .track { animation: scroll-right 40s linear infinite; }
}

.track {
	@apply: flex gap-2 whitespace-nowrap will-change-transform;

	span {
		@apply: text-lg font-urbanist backface-hidden translate-z-0;
	}

	svg {
		@apply: text-3xl h-1em w-1em;
	}
}

</style>

<!-- ANIMATIONS -->
<style lang="scss">

@keyframes scroll-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
	.track {
		animation: none !important;
	}
}
</style>
