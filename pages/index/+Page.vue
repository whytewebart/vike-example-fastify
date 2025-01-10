<template>
  <h1 class="font-urbanist">Welcome</h1>
  <div class="my-16">
    <p class="text-xl font-bold">
      FASTIFY + VIKE JS
      <span class="text-base font-400 block">
        fastify-autoload
        <br>
        fastify-env
        <br>
        <a href="/__routes__" text-red>server-routes</a>
        <br>
        ajv validator
        <br>
        
      </span>
    </p>
  </div>
  <h2 class="font-urbanist font-semibold text-2xl">All elements in this page are nested in the viewport (class), which is provided by the breakout preset, the viewport class is formed like so</h2>
  <pre class="my-6">
    bk-container-[nav,full,max,min]
    bk-values-nav-1130
    bk-values-full-900
    bk-values-max-790
    bk-values-min-620
    bk-content-585
    [&_>_*]:bk-col-content
  </pre>

  <p class="bg-red-100">
    <span class="font-bold">bk-container-[nav,full,max,min]</span> geneated the css grid code, but lacks the max width for each breakout
  </p>

  <p class="bg-red-300">
    <span class="font-bold">bk-values-[breakout-name]-[max-width]</span> 
    sets the variable for the max width of the breakout, the values must defined in descending order for example bk-values-nav-1130, bk-values-full-900, bk-values-max-790, bk-values-min-620 because the is <span class="font-bold">bk-container-[nav,full,max,min]</span>, but if the class was <span class="font-bold">bk-container-[full,nav,max,min]</span> full must be greater than nav, max must be greater than min and so on
  </p>

  <p class="bg-red-500">
    <span class="font-bold">bk-content-585</span> sets the content width, this is the width of the content grid which all content will be in by default
  </p>

  <p class="bg-red-700 text-white">
    <span class="font-bold">bk-col-content</span> set the grid column for the element, <span class="font-bold">[&_>_*]:bk-col-content</span> set the grid column for the elements under the viewport class
  </p>

  <div class="w-full h-20 bg-amber mt-6">
    <p class="text-3xl">This element is within the content grid</p>
  </div>
  <div class="w-full h-20 bg-red bk-col-min!">
    <p class="text-3xl">This element is within the min grid</p>
  </div>
  <div class="w-full h-20 bg-blue bk-col-max!"></div>
  <div class="w-full h-20 bg-violet bk-col-full!"></div>
  <div class="w-full h-20 bg-gray bk-col-root!"></div>

  <div class="mt-12 min-h-20 bg-green bk-col-full! bk-inherit">
    <p class="text-2xl mb-7">
      <span class="font-bold">bk-inherit</span> inherits the grid column of the parent (viewport) class, this is because the grid-column is applied only the direct children of the parent (viewport or bk-container-[*]) class
    </p>
  </div>

  <h2 class="text-2xl">I built this preset to eliminate the need for nesting wrappers in order to create a conatiner of different width, this was greatly motivated and impacted by <a href="https://www.youtube.com/watch?v=c13gpBrnGEw&t=390s" text-red underline>Kevin Powell</a></h2>
</template>

<script lang="ts" setup>
const pgc = usePageContext();
import Counter from "./Counter.vue";
</script>

<style lang="scss"></style>
