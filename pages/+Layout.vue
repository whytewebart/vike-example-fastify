<template>
	<MobileMenu />

	<slot />

	<Marquee />

	<Button
		variant="outline"
		size="icon-lg"
		class="fixed bottom-4 right-4 shadow z-999 max-md:hidden"
	>
		<span
			class="i-solar:question-circle-outline text-2xl text-black"
		></span>
	</Button>

	<div class="mb-12 lg:mb-6">
		<div class="flex gap-1 items-center justify-center">
			<Button variant="outline">
				<span class="i-solar:alt-arrow-down-outline text-2xl"></span>
				My Apps
			</Button>
			<Button variant="outline"> See All </Button>
		</div>

		<div v-if="data?.apps" class="apps-grid-container">
			<div
				v-for="{ id, data: d } in data.apps.sort(
					(a, b) => (b.data.priority ?? 0) - (a.data.priority ?? 0),
				)"
				:key="id"
			>
				<a :href="d.url" target="_blank">
					<img :src="d.logo.url" alt="app icon" />
				</a>
				<p>
					{{ d.appName + (!d.published ? " (coming soon)" : "") }}
				</p>
			</div>
		</div>

		<div v-else class="mt-3" flex="~ items-center justify-center">
			<Button variant="destructive" class="mx-auto">
				<span class="i-solar:restart-outline"></span>
				Apps failed to load.
				<a href="#" class="text-red-600">Click here to reload</a>
			</Button>
		</div>
	</div>

	<ArchiveGroup show-bar />

	<details open show-bar>
		<summary class="block">
			<div class="pt-8" flex="~ justify-between items-center">
				<h4 class="text-2xl text-neutral-900">
					🔁 Methodology
					<span class="hidden md:inline"> / Process</span>
				</h4>
				<Button variant="outline" as="p">
					<span
						class="i-solar:alt-arrow-down-outline text-2xl text-black"
					></span>
					How it works
				</Button>
			</div>
		</summary>

		<div class="mt-4" methodology-grid>
			<div
				data-stage
				v-for="({ duration, stage, tags, icon, svg }, i) in stages"
				:key="stage"
			>
				<div
					flex="sm:~ items-center gap-x-.7"
					class="absolute top-2 right-2 hidden"
				>
					<div
						v-for="(k, n) in stages"
						:class="{ 'bg-brand!': n == i }"
						class="h-2 w-2 rounded-full bg-neutral-300"
					></div>
				</div>

				<p>Timeline: {{ duration }}</p>
				<p class="stage">{{ stage }}</p>
				<p>{{ tags.join(", ") }}</p>

				<i v-html="svg"></i>

				<Button
					class="absolute bottom-4 shadow-sm"
					variant="outline"
					size="icon-lg"
				>
					<span :class="icon" class="text-2xl text-black"></span>
				</Button>
			</div>
		</div>
	</details>

	<section class="bk-container-inherit bk-col-root!">
		<header
			flex="~ items-center justify-center gap-1"
			class="*:text-base! text-neutral-800 mt-15 mb-4"
		>
			<Button variant="outline" as="div"
				>Here's what my process looks like</Button
			>
			<Button size="icon" variant="outline" as="div">
				<span
					class="i-solar:folder-path-connect-outline text-xl"
				></span>
			</Button>
		</header>

		<div class="process-grid bk-col-full!">
			<div v-for="v in process" :key="v.stage">
				<img :src="v.icon" :alt="v.stage" class="icon" />

				<div class="content">
					<h4>{{ v.stage }}</h4>
					<h3>{{ v.title }}</h3>
					<p>{{ v.summary }}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="misc">
		<div class="partnerships">
			<div flex="~ items-center justify-between" class="mb-4">
				<div flex="~ items-center gap-2">
					<Button
						variant="outline"
						class="text-lg font-urbanist font-semibold text-neutral-800"
						>Clients & Partnerships</Button
					>
					<Button variant="outline" size="icon">
						<span
							class="i-hugeicons:work text-2xl text-neutral-800"
						></span>
					</Button>
				</div>

				<div flex="~ items-center gap-2">
					<Button variant="outline" size="icon">
						<span
							class="i-solar:alt-arrow-left-outline text-xl text-neutral-800"
						></span>
					</Button>
					<Button variant="outline" size="icon">
						<span
							class="i-solar:alt-arrow-right-outline text-xl text-neutral-800"
						></span>
					</Button>
				</div>
			</div>

			<div class="clients">
				<ArchiveClient v-for="n in 4" :key="n" />
			</div>
		</div>

		<div class="mindscape">
			<div class="cover diagonals">
				<div class="mx-8 lg:mx-12" flex="~ col items-center gap-2">
					<Button variant="secondary" class="text-lg"
						>Explore the Mindscape</Button
					>
					<p
						class="text-5xl tracking-tight font-urbanist font-semibold text-center text-neutral-900 text-shadow-2 mindscape-text"
					>
						The Mindscape Exploration
					</p>
					<p
						class="text-neutral-700 font-urbanist text-base text-center max-w-sm font-medium leading-tight"
					>
						Check out my unpublished creatives and projects, take a
						look into my creative space. Heads up, it's a mess!
					</p>

					<a
						href="https://www.instagram.com/mindscape.whytewebart/"
						class="bg-white p-1 rounded-lg shadow-sm"
					>
						<img src="@/assets/icons/instagram.svg" alt="" />
					</a>
				</div>
			</div>
			<div class="mt-3">
				<h4>
					Check out my unpublished creatives and projects, take a look
					into my creative space. Heads up, it's a mess!
				</h4>

				<div flex="~ items-center justify-between" class="mt-3">
					<Button
						variant="outline"
						class="text-lg font-urbanist font-semibold text-neutral-800"
					>
						Instagram
						<span class="i-solar:arrow-right-outline"></span>
					</Button>

					<div flex="~ items-center gap-1">
						<a
							href="https://threads.net/@whytewebart"
							class="i-hugeicons:threads text-4xl text-neutral-800"
						></a>
						<a
							href="https://www.instagram.com/whytewebart/"
							class="i-hugeicons:instagram text-4xl text-neutral-800"
						></a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-20 bk-container-inherit bk-col-root!">
		<div
			flex="~ items-center gap-x-2 wrap gap-y-1"
			lg="hidden"
			class="mb-6"
		>
			<Button variant="outline" class="text-base text-neutral-800"
				>Quick Requests</Button
			>
			<Button variant="secondary" class="text-base text-neutral-900">
				Tell me about your project
				<span class="i-hugeicons:waving-hand-02 text-3xl ml-2"></span>
			</Button>
		</div>

		<div grid="~ lg:cols-2 items-stretch gap-x-4" class="bk-col-nav!">
			<div
				flex="~ col items-center justify-center"
				class="bg-neutral-800 py-4"
				lg="diagonals bg-white shadow-sm"
			>
				<Select multiple v-model="selectedServices">
					<SelectTrigger class="w-full max-w-xs shadow-xs bg-white">
						<SelectValue
							placeholder="Select a service"
							class="text-base font-medium font-urbanist"
						/>
					</SelectTrigger>

					<SelectContent class="max-h-sm">
						<template
							v-for="category in services.categories"
							:key="category.id"
						>
							<SelectGroup>
								<SelectLabel class="font-bold text-primary">
									{{ category.label }}
								</SelectLabel>

								<template
									v-for="group in category.groups"
									:key="group.label"
								>
									<SelectLabel
										class="pl-4 text-muted-foreground text-xs"
									>
										{{ group.label }}
									</SelectLabel>

									<SelectItem
										v-for="service in group.services"
										:key="`${category.id}-${group.label}-${service}`"
										:value="service"
										class="pl-8"
									>
										{{ service }}
									</SelectItem>
								</template>
							</SelectGroup>
						</template>
					</SelectContent>
				</Select>

				<div
					class="selected-services mt-2 ml-4"
					flex="~ items-center lg:justify-center gap-1 wrap"
					v-if="selectedServices.length > 0"
				>
					<template v-for="service in selectedServices">
						<p
							class="px-2 py-1 bg-neutral-600 rounded-full border border-neutral-400 text-sm text-neutral-200"
							lg="bg-neutral-100 border-neutral-300 text-neutral-800"
						>
							{{ service }}
						</p>
					</template>
				</div>
			</div>
			<div>
				<div
					flex="lg:~ items-center justify-center gap-x-2 wrap gap-y-1"
					class="mb-6 hidden"
				>
					<Button variant="outline" class="text-base text-neutral-800"
						>Quick Requests</Button
					>
					<Button
						variant="secondary"
						class="text-base text-neutral-900"
					>
						Tell me about your project
						<span
							class="i-hugeicons:waving-hand-02 text-3xl ml-2"
						></span>
					</Button>
				</div>

				<div class="request-form-container">
					<RequestForm :selected-services />
					<img src="@/assets/form-bg.png" />
				</div>
			</div>
		</div>
	</section>

	<p class="text-5xl mt-8 text-center">···</p>

	<footer class="pb-32 pt-24 body-bg">
		<div class="logo-box">
			<div class="logo-icon"></div>
		</div>
		<div class="mx-a" flex="~ col items-center">
			<div flex="~ items-center justify-center gap-1">
				<Button variant="outline" class="text-base text-neutral-800"
					>Connect with me</Button
				>

				<Button
					variant="outline"
					size="icon"
					class="text-base text-neutral-800"
				>
					<span
						class="i-solar:chat-round-call-outline text-2xl"
					></span>
				</Button>
			</div>

			<h4
				class="text-4xl font-urbanist font-semibold text-center tracking-tight leading-7.5 my-3 max-w-lg"
			>
				I collaborate with <span class="text-#1780e3">Founders</span>,
				<span class="text-#1780e3">Schools</span>, and
				<span class="text-#1780e3">Businesses</span> to deliver
				thoughtful designs and efficient systems
			</h4>

			<div flex="~ items-center justify-center gap-1 wrap">
				<Button variant="outline" size="icon-lg" class="flex">
					<span class="i-hugeicons:mail-at-sign-01 text-3xl"></span>
				</Button>

				<Button
					variant="outline"
					class="text-base text-neutral-800 font-urbanist font-600"
					as="a"
					href="mailto:wills.yte50@gmail.com"
					>wills.yte50@gmail.com</Button
				>

				<Button
					variant="outline"
					class="text-sm font-urbanist font-600"
					size="lg"
				>
					Send a message
					<span
						class="i-solar:arrow-right-up-outline text-2xl ml-4"
					></span>
				</Button>
			</div>
		</div>
	</footer>
</template>

<script lang="ts" setup>
// Assets: METHODOLOGY SVGs
import discovery from "@/assets/patterns/discovery.svg?raw";
import architecture from "@/assets/patterns/architecture.svg?raw";
import implementation from "@/assets/patterns/implementation.svg?raw";
import delivery from "@/assets/patterns/delivery.svg?raw";
// ASSETS: PROCESS ICONS
import blocks from "@/assets/icons/blocks.png?url";
import codeblock from "@/assets/icons/codeblock.png?url";
import folder from "@/assets/icons/folder.png?url";
import target from "@/assets/icons/target.png?url";
import { Response } from "./+data";
// ASSETS: SERVICES.JSON
import services from "@/assets/services.json";
// PROCESS STAGES
const stages = [
	{
		duration: "3-7d",
		stage: "Discovery and Planning",
		tags: ["Research", "Analysis", "Strategy"],

		icon: "i-solar:magnifer-outline",
		svg: discovery,
	},
	{
		duration: "7d",
		stage: "Architecture",
		tags: ["Architecture", "Planning", "Systems Design"],

		icon: "i-solar:database-outline",
		svg: architecture,
	},
	{
		duration: "7-14d",
		stage: "Implementation",
		tags: ["Development", "Integration", "Iteration"],

		icon: "i-solar:sledgehammer-outline",
		svg: implementation,
	},
	{
		duration: "7d",
		stage: "Refinement & Delivery",
		tags: ["Optimization", "QA", "Deployment"],

		icon: "i-solar:rocket-outline",
		svg: delivery,
	},
];
const process = [
	{
		stage: "Discovery",
		title: "Understanding Before Building",
		summary:
			"Every successful system starts with clarity. Before writing code, I focus on understanding the real problem.",

		icon: folder,
	},
	{
		stage: "Architecture",
		title: "Designing the System",
		summary:
			"With clarity established, the next step is defining how the system should behave—structurally and logically.",

		icon: blocks,
	},
	{
		stage: "Implementation",
		title: "Building with Precision",
		summary:
			"Development is executed against a defined structure. The focus is on writing clean, reusable, and predictable code that aligns with the system design.",

		icon: codeblock,
	},
	{
		stage: "Refinement & Delivery",
		title: "Optimizing for Real Use",
		summary:
			"Before delivery, the system is refined for performance, usability, and long-term reliability. This ensures the product doesn’t just work—it works well.",

		icon: target,
	},
];

const data = useData<Response>();
const selectedServices = ref<string[]>([]);
</script>

<style lang="scss" scoped>
footer {
	@apply: relative z-999;
}

.logo-box {
	@apply: w-full max-w-100 aspect-ratio-square relative mx-a mb-6;
	.logo-icon {
		@apply: size-full rounded-3xl_;
		background:
			linear-gradient(180deg, #1780e3 38.88%, rgba(23, 128, 227, 0) 100%),
			conic-gradient(from 180deg at 50% 50%, #ffffff 0%, #1780e3 100%);

		&:before {
			@apply: content-empty size-10 absolute top--3 right--3;
			@apply: border-3 border-#1780e3 border-l-0 border-b-0;
		}

		&:after {
			@apply: content-empty size-10 absolute bottom--3 left--3;
			@apply: border-3 border-#1780e3 border-t-0 border-r-0;
		}
	}

	&:before {
		@apply: content-empty size-10 absolute top--3 left--3;
		@apply: border-3 border-#1780e3 border-r-0 border-b-0;
	}

	&:after {
		@apply: content-empty size-10 absolute bottom--3 right--3;
		@apply: border-3 border-#1780e3 border-t-0 border-l-0;
	}
}

.apps-grid-container {
	@apply: flex items-center justify-center gap-2 wrap;
	& > div {
		@apply: flex flex-col items-center gap-y-1.5;
		img {
			@apply: w-34 sm:w-36 my-3;
		}
		p {
			@apply: px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200 w-fit font-semibold font-urbanist text-neutral-700;
		}

		&:has(a[href]:hover) {
			p {
				@apply: bg-white;
			}
		}
	}
}

[methodology-grid] {
	display: grid;
	@apply: gap-3;
	@screen sm {
		@apply: gap-2.5;
		grid-template-columns: repeat(10, 1fr);
	}

	&:has([data-stage]:hover) {
		& > [data-stage]:not(:hover) {
			@apply: opacity-50;
			--svg-n-fill: theme("colors.gray.300");
		}
	}

	& > div {
		@apply relative pt-7 pb-17 bg-neutral-100 flex flex-col justify-center items-center overflow-clip transition-all duration-300;
		&:first-child {
			i:has(svg) {
				@apply: right-0;
			}
		}

		&:last-child {
			i:has(svg) {
				@apply: right-0;
			}
		}
		@screen sm {
			@apply: pt-7 pb-17;

			&:first-child {
				@apply: col-start-1 col-end-7;
			}
			&:nth-child(2) {
				@apply: col-start-7 col-end-11;
			}
			&:nth-child(3) {
				@apply: row-start-2 col-start-1 col-end-6;
			}
			&:last-child {
				@apply: row-start-2 col-start-6 col-end-11;
			}
		}

		p {
			@apply: text-center text-gray-600 text-3.5 leading-3;

			&.stage {
				@apply: text-neutral-900 font-urbanist text-xl font-600 leading-normal;
			}
		}

		i:has(svg) {
			@apply: absolute bottom-0;
		}

		box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.44);
	}
}

details[show-bar] {
	@apply: relative;
	&::before {
		@apply: content-empty absolute top-6 left--8 w-4 border-2 b-r-0 b-t-0 border-neutral-300;
		height: calc(100% - 2.5rem);
	}

	&[open] {
		&::before {
			height: calc(100% - 4.5rem);
		}
	}
}

.process-grid {
	@apply: grid sm:grid-cols-2 gap-2;
	& > div {
		background: linear-gradient(
			135deg,
			#ffffff 0% 0%,
			#ffffff 10% 10%,
			#ededed 17% 17%,
			#ffffff 28% 28%
		);
		@apply: lg:rounded-2xl relative *:relative *:z-1;
		@apply: border border-divider/40;
		@apply: grid justify-between;

		.content {
			padding: clamp(1.5rem, 3vw, 2rem);
			h4 {
				@apply: rounded-full py-1 px-3 border border-neutral-300 w-fit text-neutral-700 font-600 sm:mb-2 bg-neutral-100 sm:bg-white;
			}

			h3 {
				@apply: font-urbanist text-xl font-600 leading-normal text-brand;
			}

			p {
				@apply: font-urbanist sm:text-2xl tracking-tight font-500 sm:font-700 max-sm:leading-4 sm:leading-6 text-neutral-900;
			}
		}

		img {
			@apply: h-xs w-full object-contain object-center;
		}

		&::before {
			@apply: content-empty absolute top-1.5 left-1.5 right-1.5 bottom-1.5 bg-neutral-50/30 border border-divider lg:border-op-50 lg:rounded-xl max-md:_h-3/5;
			@apply: md:top-2 md:bottom-2 md:left-2 md:right-2;
		}
	}
}
</style>

<style lang="scss">
section.misc {
	@apply: bk-col-nav! mt-15;
	@apply: grid lg:grid-cols-[1.3fr_1fr] gap-x-3 gap-y-8;

	.mindscape-text {
		text-shadow:
			3px 3px 0 theme("colors.white"),
			-3px -3px 0 theme("colors.white"),
			3px -3px 0 theme("colors.white"),
			-3px 3px 0 theme("colors.white"),
			4px 4px 0 theme("colors.neutral.300"),
			-4px -4px 0 theme("colors.neutral.300"),
			4px -4px 0 theme("colors.neutral.300"),
			-4px 4px 0 theme("colors.neutral.300");
	}

	& > div {
		&.mindscape {
			@apply: grid grid-rows-[1fr_auto];
			.cover {
				@apply: shadow-sm bg-white min-h-screen-sm;
				@apply: flex justify-center items-center;
			}

			h4 {
				@apply: font-urbanist text-2xl font-semibold text-neutral-800 leading-7 lg:leading-8;
			}
		}
	}

	.clients {
		@apply: grid sm:grid-cols-2 gap-x-2 gap-y-6;
	}
}
</style>

<style lang="scss">
.request-form-container {
	@apply: relative grid;

	& > *:not(img) {
		@apply: z-1 relative;
	}

	img {
		@apply: w-full h-full object-cover absolute top-0 left-0 right-0;
	}
}
</style>
