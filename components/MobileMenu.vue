<template>
  <div fixed top-0 z-20 overflow-y-auto h-screen id="mobile-menu">
    <div
      class="h-screen bg-accent pt-30 pb-4"
      grid="~ rows-[auto_auto] content-between"
    >
      <!-- HAMBURGER MENU -->
      <Button
        icon="i-heroicons-x-mark-solid text-xl"
        size="small"
        severity="secondary"
        pt:root="mb-4 float-end fixed! top-4 right-4 bg-white! rounded-full!"
        @click="() => bus.emit('close')"
      />

      <ul class="px-4" flex="~ col gap-y-2">
        <li v-for="link in links" :key="link.name">
          <Link
            :href="link.path"
            class="text-2xl font-semibold! tracking-tight text-alabaster/70 bg-transparent! font-urbanist transition-all rounded-lg"
            flex="~ items-center justify-between gap-x-2"
            hover="bg-gray-50/50! cursor-pointer text-white!"
          >
            <span>{{ link.name }}</span>
            <Button
              icon="i-heroicons-arrow-right-solid"
              text
              pt:icon="text-l text-white"
            />
          </Link>
        </li>
      </ul>

      <div class="px-4 space-y-2">
        <Button
          label="Start Project"
          severity="secondary"
          size="large"
          pt:label="text-2xl font-medium! tracking-tighter text-accent font-epilogue"
          pt:root="bg-white! rounded-xl!"
          fluid
        />
        <Button
          label="Troubleshoot My App"
          severity="secondary"
          size="large"
          pt:label="text-2xl font-medium! tracking-tighter text-white font-epilogue"
          pt:root="bg-white/50! rounded-xl! b-none!"
          fluid
        />
      </div>
    </div>
    <div class="py-2 text-center bg-alabaster" id="tagline">
      <span
        class="font-epilogue text-neutral-900 text-sm tracking-tight font-medium"
        >“Big ideas start small.”</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  links: {
    path: string;
    name: string;
  }[];
}>();
defineEmits<{
  (e: "close"): void;
}>();

const bus = useEventBus<string>("mobile-menu");
onMounted(() => {
  // HIDE BODY SCROLL
  const body = document.querySelector("body") as HTMLBodyElement;
  body.classList.add("overflow-hidden");
});

onBeforeUnmount(() => {
  // SHOW BODY SCROLL
  const body = document.querySelector("body") as HTMLBodyElement;
  body.classList.remove("overflow-hidden");
});
</script>

<style>
#tagline {
  box-shadow: inset 0px 10px 18px -14px #00000080;
}

#mobile-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
