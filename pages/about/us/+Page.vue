<template>
    <h1> We are plenty </h1>
</template>

<script setup>
import { onServerPrefetch } from 'vue';

console.log("abut us")

onServerPrefetch(() => {
    console.log("loading server")
})
</script>