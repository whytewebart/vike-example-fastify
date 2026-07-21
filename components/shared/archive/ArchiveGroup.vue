<template>
	<div archive-group>
		<div flex="~ items-end justify-between">
			<div>
				<h3
					class="font-medium tracking-tight text-2xl text-neutral-800"
				>
					Work Archive
				</h3>
				<p class="max-w-62.5 text-sm leading-snug">
					Mobile, Web, and Desktop Applications — from Servers to UI
				</p>
			</div>
			<Button
				class="whitespace-nowrap right--2.5 relative"
				variant="outline"
				as-child
			>
				<a href="/work">[See All Archive]</a>
			</Button>
		</div>

		<div class="clients-grid mt-4">
			<!-- CLIENT COMPONENT -->
			<ArchiveCard v-for="client in clients" :client :key="client.id" />
		</div>

		<template v-if="clients.length === 0">
			<div flex="~ items-center justify-center">
				<Button variant="destructive" @click="() => { console.log('----') }">
					<span class="i-solar:restart-outline"></span>
					Failed to Load Work Archive '25
					<span class="text-red-600">Click here to reload</span>
				</Button>
			</div>
		</template>
	</div>
</template>

<script lang="tsx" setup>
import { ofetch } from "ofetch";

const context = usePageContext();
const data = useData<any>();

const clients = ref([]);
const loading = ref(false);

const fetchClients = async () => {
	// SET LOADING
	loading.value = true;
	console.log(data.value);
	// CHECK IF DATA IS AVAILABLE
	if (data.value?.clients && data.value.clients.length > 0) {
		clients.value = data.value?.clients;
		return;
	}

	const plasmicEnv = context.value.config.secrets;

	const options = {
		method: "GET",
		headers: { "x-plasmic-api-cms-tokens": plasmicEnv!.token },
		query: {
			q: {
				limit: 3,
			},
		},
	};

	await ofetch(
		`https://data.plasmic.app/api/v1/cms/databases/${plasmicEnv?.databaseId}/tables/clients/query`,
		{
			...options,
			timeout: 2000,
			async onResponse({ response }) {
				if (response.status !== 200)
					throw new Error("Failed to fetch data from Plasmic CMS");
				clients.value = await response._data.rows;
			},
		},
	)
		.then(() => {})
		.catch((e) => {})
		.finally(() => (loading.value = false));
};

await fetchClients();
// onMounted(fetchClients);

defineOptions({
	inheritAttrs: true,
});
</script>

<style lang="scss">
.clients-grid {
	--at-apply: grid gap-x-3 gap-y-7;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	align-items: start;
}

[archive-group][show-bar] {
	@apply: relative;
	&::before {
		@apply: content-empty absolute top-6 left--8 w-4 border-2 b-r-0 b-b-0 border-neutral-300;
		height: calc(100% + 0.5rem);
	}
}
</style>
