<template>
	<div archive-grid-item grid="~">
		<div flex="~ justify-between" class="text-sm">
			<p>{{ data.projectType }}</p>
			<p class="font-semibold">
				{{ publishedDate }}
			</p>
		</div>
		<div ref="target" archive-grid-image>
			<img
				:src="data.thumbnail.url"
				alt=""
				class="w-full h-full object-contain z-1 relative"
			/>

			<Button
				variant="secondary"
				as-child
				size="lg"
				label="Visit Application"
				data-animate="visit-app"
			>
				<a :href="data.url">
					Visit Project
					<span class="i-solar-link-bold"></span>
				</a>
			</Button>

			<div
				class="absolute bottom-0 left-0 right-0 bg-gray-100 h-0"
				:data-animate-key="data.url"
				data-animate="alt-bg"
			></div>
		</div>
		<h3 class="font-medium text-xl text-neutral-800 tracking-tighter">
			<a :href="data.url">
				{{ data.client }}
				<span class="i-solar:arrow-right-up-outline float-right"></span>
			</a>
		</h3>
		<p class="truncate-overview" ref="content">
			{{ data.overview }}
		</p>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	client: Record<string, any>;
}>();

const data = toRef(() => props.client.data);
const target = templateRef<HTMLElement>("target", null);
const content = templateRef<HTMLElement>("content", null);
const publishedDate = new Intl.DateTimeFormat("en-US", {
	month: "2-digit",
	year: "numeric",
}).format(new Date(data.value.published));
</script>

<style lang="scss">
.truncate-overview {
	@apply: tracking-tight leading-5 line-clamp-3 text-neutral-500;
	transition: all 0.3s ease-in-out;
}

.visit-site-btn {
	background: url("assets/background-v2.png");
	background-size: 128px auto;
	@apply: bg-alabaster;
}

[archive-grid-item] {
	[archive-grid-image] {
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
		@apply: bg-white h-80 sm:h-100 w-full my-2 p-4 relative overflow-hidden;
		[data-slot="button"] {
			@apply: absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
			@apply: opacity-0;
		}

		&:hover {
			@apply: bg-#FDFDFD;
			[data-slot="button"] {
				@apply: bg-secondary ring ring-blue z-1 opacity-100;
			}
		}
	}
}

[archive-group] {
	&:has([archive-grid-item]:hover) {
		[archive-grid-item] {
			&:not(:hover) {
				@screen lg {
					h3,
					p {
						@apply: opacity-50 font-300 [&_span]:hidden;
					}

					[archive-grid-image] {
						@apply: bg-neutral-100 shadow-none border border-neutral-300;
					}
				}
			}
		}
	}
}
</style>
