<template>
	<nav flex="~">
		<!-- brand-image -->
		<a href="/" data-logo-box>
			<div class="logo">
				<div></div>
			</div>
		</a>

		<ul>
			<li>
				<a href="/work">Work Archive</a>
			</li>
			<li>
				<button>Menu</button>
			</li>
		</ul>
	</nav>
</template>

<style lang="scss" scoped>
[data-logo-box] {
	@apply: p-.5 bg-alabaster rounded-2xl;
	@apply: ring-1 ring-#1B81E0;
	@apply: transition-all duration-300;

	&:hover {
		@apply: p-0;
		.logo div {
			@apply: opacity-0;
		}
	}

	.logo {
		background:
			linear-gradient(180deg, #1780e3 38.88%, rgba(23, 128, 227, 0) 100%),
			conic-gradient(from 180deg at 50% 50%, #ffffff 0%, #1780e3 100%);
		@apply: w-15 h-15 bg-neutral-500 relative p-1.5 rounded-2xl;
		@apply: transition-all duration-300;

		div {
			background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0) 0%,
				#ffffff 100%
			);
			@apply: w-full h-full rounded-full;
		}
	}
}

nav {
	@apply: flex items-stretch gap-2 w-fit;
	@apply: fixed bottom-6 left-0 right-0 z-999 mx-a;
}

nav ul {
	@apply: p-.5 bg-alabaster rounded-2xl;
	@apply: ring-1 ring-#1B81E0;
	@apply: flex items-stretch gap-1;

	li > a,
	li > button {
		@apply: bg-neutral-100 font-urbanist text-lg text-neutral-700 block h-full;
		@apply: rounded-2xl border border-neutral-300;
		@apply: flex items-center justify-center px-3 font-semibold;
		@apply: transition-all duration-300;
	}

	&:has(li:hover) {
		li:hover > a,
		li:hover > button {
			@apply: bg-white border-neutral-300 px-5;
		}

		li:not(:hover) {
			@apply: opacity-50;
		}
	}
}

@screen lg {
	ul,
	[data-logo-box] {
		@apply: shadow-lg;
	}
	[data-logo-box] {
		@apply: p-1 ring-1.5;
		.logo {
			@apply: w-20 h-20 rounded-xl p-2;
		}
	}

	nav ul {
		@apply: rounded-3xl p-1 ring-1.5;

		li > a,
		li > button {
			@apply: rounded-3xl text-xl;
		}
	}
}
</style>
