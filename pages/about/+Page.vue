<script setup lang="ts">
import { useHead, useSeoMeta } from "@unhead/vue"

useHead({
  bodyAttrs: {
    style: 'background: salmon; color: cyan;'
  },
})

useSeoMeta({
  // title: 'About Myself',
  description: 'My about page',
  ogDescription: 'Still about my about page',
  ogTitle: 'About',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <h1>About</h1>
  <p>Example of app using Vike.</p>
</template>

<style>
code {
  font-family: monospace;
  background-color: #eaeaea;
  padding: 3px 5px;
  border-radius: 4px;
}
</style>
