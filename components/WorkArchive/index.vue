<template>
  <div>
    <div flex="~ items-end justify-between">
      <div>
        <h3 class="font-medium tracking-tight text-2xl text-neutral-800">
          Work Archive
        </h3>
        <p class="max-w-62.5 text-sm leading-snug">
          Mobile, Web, and Desktop Applications — from Servers to UI
        </p>
      </div>
      <Button
        label="[See All Archive]"
        pt:label="whitespace-nowrap"
        text
        size="small"
        severity="secondary"
        as="a"
        href="/work"
      />
    </div>

    <div class="clients-grid mt-4">
      <!-- CLIENT COMPONENT -->
      <WorkArchiveCard v-for="client in clientsComputed" :client :key="client.id" />
    </div>

    <template v-if="clientsComputed.length === 0">
      <div class="">
        <p
          class="text-xl text-center text-neutral-800"
          hover="text-accent/80 cursor-pointer"
          @click="
            loading = true;
            // navigate(context.urlOriginal, { keepScrollPosition: true });
            fetchClients().finally(() => (loading = false));
          "
        >
          <span
            class="i-solar-refresh-bold mr-1"
            :class="{ 'animate-spin': loading }"
          ></span>
          Failed to Load Work Archive '25
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="tsx" setup>
import { ofetch } from "ofetch";
import { Button } from "primevue";

const context = usePageContext();
const data = useData<any>();

const clients = ref();
const loading = ref(false);

const clientsComputed = computed(() => {
  if (
    clients.value &&
    Array.isArray(clients.value) &&
    clients.value.length > 0
  ) {
    return clients.value;
  }

  return data.value.clients;
});

const fetchClients = async () => {
  // CHECK IF DATA IS AVAILABLE
  if (data.value.clients.length > 0) return clients.value = data.value.clients;
  const plasmicEnv = context.value.config.secrets

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

        // console.log("ran once");
        context.value.data!.clients = await response._data.rows;
        clients.value = context.value.data!.clients;
        // console.log(context.value.data);
      },
    }
  ).catch((e) => console.log(e));
};

onServerPrefetch(fetchClients);
// onMounted(fetchClients);

// TOGGLE PROCESS STEPS
const processSteps = ref<0 | 1>(0);
const borderLine = ref(["h-[calc(100%_-_6.5rem)]", "h-[calc(100%_-_22rem)]"]);

// watch(
//   [data, () => context.value.data],
//   ([newvalue, newvalue2], [oldvalue, oldvalue2]) => {
//     if (oldvalue.clients && oldvalue.clients.length > 0) {
//       if (newvalue.clients.length === 0) {
//         data.value = oldvalue;
//       }
//     }

//     // setTimeout(() => (loading.value = false), 2000);
//   }
// );

defineOptions({
  inheritAttrs: true,
});
</script>

<style lang="scss">

.clients-grid {
  --at-apply: grid gap-3;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-items: start;
}
</style>
