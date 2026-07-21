<template>
  <h1>{{ data?.movie.title }}</h1>
  <p>Release Date: {{ data?.movie.release_date }}</p>
  <br />
  <p>Director: {{ data?.movie.director }}</p>
  <br />
  <p>Producer: {{ data?.movie.producer }}</p>

  <div class="bk-col-min">
    <HealthStatus />
  </div>
</template>

<script lang="ts" setup>
const data = useData<any>();
const h = useHealth();
const health = storeToRefs(h);

onServerPrefetch(() => {
  // Test [ pinia ] in vue hook
  // Expected [ success ]
  // h.set({
  //   runtime: `NodeJs ${crypto.randomUUID()}`,
  //   platform: "server",
  // });
});
</script>
