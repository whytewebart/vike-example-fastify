<template>
  <div data-animate="box" class="box">Animate me</div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useGsap } from '../../composables/animate';

useGsap(() => {}, { plugins: ['SplitText'] })

// Use GSAP with ScrollTrigger and MorphSVGPlugin
useGsap(({ gsap, key, plugins }) => {
  const el = document.querySelector(key('box'));

  if (el) {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play none none reverse',
        markers: true, // debug only
      },
      x: 200,
      duration: 1,
      backgroundColor: '#ff4081',
    });
  }

  // You can also access MorphSVGPlugin via plugins.MorphSVGPlugin if needed
}, {
  plugins: ['ScrollTrigger', 'MorphSVGPlugin']
});
</script>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background: #3f51b5;
  margin-top: 200vh; /* for scroll */
}
</style>
