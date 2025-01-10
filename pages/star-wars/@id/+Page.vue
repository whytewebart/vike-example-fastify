<template>
  <h1>{{ data.movie.title }}</h1>
  <p>Release Date: {{ data.movie.release_date }}</p>
  <br />
  <p>Director: {{ data.movie.director }}</p>
  <br />
  <p>Producer: {{ data.movie.producer }}</p>
</template>

<script lang="ts" setup>
import type { Data } from "./+data";
const data = useData<Data>();

onMounted(() => {
  console.log(usePageContext().value);
});
</script>
