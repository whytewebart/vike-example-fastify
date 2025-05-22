<template>
  <div relative>
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

    <div flex="~ items-center justify-between" class="mt-9">
      <h3 class="font-medium tracking-tight text-2xl text-neutral-800">
        🔁 My Process
      </h3>
      <Button
        :label="processSteps == 0 ? '[Expand]' : '[Collapse]'"
        text
        size="small"
        severity="contrast"
        pt:label="font-bold"
        @click="toggleProcessSteps"
      />
    </div>

    <!-- MY PROCESS GRID -->
    <div class="process-grid transition-all" v-show="processSteps == 1">
      <div>
        <img src="assets/process/communicate.webp" />
        <span>1</span>
      </div>
      <div>
        <img src="assets/process/identify.webp" />
        <span>2</span>
      </div>
      <div>
        <img src="assets/process/troubleshoot.webp" />
        <span>3</span>
      </div>

      <div>
        <img src="assets/process/listen.webp" />
        <span>4</span>
      </div>
      <div>
        <img src="assets/process/breakdown.webp" />
        <span>5</span>
      </div>

      <div>
        <img src="assets/process/simplify.webp" />
        <span>6</span>
      </div>
      <div>
        <img src="assets/process/revert.webp" />
        <span>7</span>
      </div>
      <div>
        <img src="assets/process/complete-and-polish.webp" />
        <span>8</span>
      </div>
    </div>

    <div class="mt-6">
      <h4 class="text-neutral-800 process-steps-text -tracking-.4 font-medium">
        Communicate → Identify →
        <span class="text-blue-700">Troubleshoot</span> <br />
        Listen → Break Down → <span class="text-blue-700">Simplify</span> <br />
        Revert if needed → <span class="text-blue-700">Complete & Polish</span>
        <br />
      </h4>
    </div>

    <div
      id="border-line"
      :class="[
        'absolute top-10 -left-8 w-4',
        borderLine[processSteps],
        'hidden md:block',
      ]"
      border="2 text r-0"
    ></div>
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
  const plasmicEnv = context.value.config.secrets as {
    token: string;
    databaseId: string;
  };

  const options = {
    method: "GET",
    headers: { "x-plasmic-api-cms-tokens": plasmicEnv.token },
    query: {
      q: {
        limit: 3,
      },
    },
  };

  await ofetch(
    `https://data.plasmic.app/api/v1/cms/databases/${plasmicEnv.databaseId}/tables/clients/query`,
    {
      ...options,
      timeout: 2000,
      async onResponse({ response }) {
        if (response.status !== 200)
          throw new Error("Failed to fetch data from Plasmic CMS");

        // console.log("ran once");
        // @ts-ignore
        context.value.data.clients = await response._data.rows;
        clients.value = context.value.data.clients;
        // console.log(context.value.data);
      },
    }
  ).catch((e) => console.log(e));
};

onServerPrefetch(fetchClients);
onMounted(async () => {
  // console.log(data.value);
  // console.log(context.value.data.clients);

  if (data.value.clients.length === 0) {
    await fetchClients();
  }

  if (data.value.clients.length > 0) {
    clients.value = data.value.clients;
  }
});

// TOGGLE PROCESS STEPS
const processSteps = ref<0 | 1>(0);
const borderLine = ref(["h-[calc(100%_-_6.5rem)]", "h-[calc(100%_-_22rem)]"]);
const toggleProcessSteps = () =>
  (processSteps.value = processSteps.value === 0 ? 1 : 0);

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
  @apply: grid gap-3;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-items: start;
}

.process-grid {
  @apply: [&>div]:bg-gray-100 h-170 md:h-60 text-lg mt-6 grid grid-cols-2 grid-rows-19 md:grid-rows-12 md:grid-cols-5 gap-2;

  & > div {
    @apply: relative bg-gray-100 overflow-hidden;

    &:nth-of-type(1) {
      @apply: col-start-1 row-start-1 row-span-9 md:row-span-12;
    }

    &:nth-of-type(2) {
      @apply: col-start-2 row-start-1 row-end-5 md:row-end-6;
    }

    &:nth-of-type(3) {
      @apply: col-start-2 row-start-5 row-end-10 md:row-start-6 md:row-end-13;
    }

    &:nth-of-type(4) {
      @apply: col-start-1 row-start-10 row-end-15 md:col-start-3 md:row-start-1 md:row-end-8;
    }

    &:nth-of-type(5) {
      @apply: col-start-2 row-start-10 row-end-15 md:col-start-3 md:row-start-8 md:row-end-13;
    }

    &:nth-of-type(6) {
      @apply: col-start-1 row-span-19 md:col-start-4 md:row-span-12;
    }

    &:nth-of-type(7) {
      @apply: col-start-2 row-start-15 row-end-19 md:col-start-5 md:row-start-1 md:row-end-7;
    }

    &:nth-of-type(8) {
      @apply: col-start-2 row-start-19 row-end-34 md:col-start-5 md:row-start-7 md:row-end-13;
    }

    span {
      font-weight: 600;
      @apply: bg-gray- block w-fit rounded-full px-4 py-2 absolute top-0 left-0 z-1 text-white;
    }

    img {
      @apply: w-full h-full object-cover;
    }
  }
}

.process-steps-text {
  font-size: clamp(1.5rem, 1rem + 0.5vw, 1.5rem);
  line-height: 1.25em;
  /* 28px */
}
</style>
