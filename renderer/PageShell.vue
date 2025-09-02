<script lang="ts" setup>
import Link from './Link.vue';

</script>

<template>
  <div id="view-container" min-h-screen bg-alabaster>
    <div class="navigation">
      <a href="/" class="logo">
        <img src="/logo.svg" height="64" width="64" />
      </a>
      <Link href="/">Welcome</Link>
      <Link href="/about">About</Link>
      <Link href="/star-wars">Data Fetching</Link>
      <Link href="/ping">Routing</Link>
    </div>
    <div id="view-content" class="viewport h-full">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
#view-container {
  position: relative;
  width: 100%;
  display: flex;
  // max-width: 900px;
  // margin: auto;
}
#view-container::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  // background: no-repeat url('./styles/page-animation/loading.svg');
  background-size: 100px;
  background-position: center center;
  pointer-events: none;
  opacity: 0;
}
body.page-is-transitioning #view-container::before {
  opacity: 1;
}

#view-content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
  flex-grow: 1;
}

#view-content,
#view-container::before {
  transition: opacity 0.5s ease-in-out;
}
body.page-is-transitioning #view-content {
  opacity: 0.17;
}

.navigation {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
  border-right: 2px solid #eee;
}
.logo {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>