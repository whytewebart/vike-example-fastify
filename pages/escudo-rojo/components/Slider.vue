<template>
  <div class="slider-component" ref="sliderContainer">
    <div class="slider-images" ref="sliderTrack">
      <!-- images -->
      <img src="../assets/slider-01.webp" alt="" />
      <img src="../assets/slider-02.webp" alt="" />
      <img src="../assets/slider-03.webp" alt="" />
      <!-- images-end -->
    </div>

    <div class="content p-5">
      <p class="tracking-tight leading-snug text-neutral-100">
        The grapes are monitored regularly as they ripen, block by block, in
        accordance with a precise protocol established by Baron Philippe de
        Rothschild Chile's winemakers.
      </p>
    </div>

    <div class="slider-controls">
      <span
        v-for="(_, index) in slidesCount"
        :key="index"
        :class="{
          'bg-neutral-100': activeSlide === index,
          'bg-white/50': activeSlide !== index,
        }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

// Refs
const sliderContainer = ref<HTMLElement | null>(null);
const sliderTrack = ref<HTMLElement | null>(null);
const activeSlide = ref(0);
const slidesCount = ref(0);
const autoScrollInterval = ref<NodeJS.Timeout | null>(null);
const scrollInterval = 1000;

const checkActiveSlide = () => {
  if (!sliderTrack.value || !sliderContainer.value) return;

  // Check if we should use vertical layout (desktop/tablet)
  const mql = window.matchMedia("(min-width: 820px)");
  const containerWidth = sliderContainer.value.offsetWidth;
  const scrollPosition = sliderTrack.value.scrollLeft;

  const containerHeight = sliderContainer.value.offsetHeight;
  const scrollPositionVertical = sliderTrack.value.scrollTop;

  // Calculate which slide is currently centered
  if (mql.matches) {
    var r = (scrollPositionVertical / containerHeight);
    // console.log(Number(r.toFixed(2)))
    r = -r > 1 ? -2 : r;
    activeSlide.value = Math.round(-r)
    return
  }
  activeSlide.value = Math.round(scrollPosition / containerWidth);
};

const pauseAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
    autoScrollInterval.value = null;
  }
};

const startAutoScroll = () => {
  pauseAutoScroll();

  autoScrollInterval.value = setInterval(() => {
    const nextSlide = (activeSlide.value + 1) % slidesCount.value;
    goToSlide(nextSlide);
  }, scrollInterval);
};

const goToSlide = (index: number) => {
  if (!sliderTrack.value || !sliderContainer.value) return;

  // Stop autoplay temporarily when user manually navigates
  pauseAutoScroll();

  const containerWidth = sliderContainer.value.offsetWidth;
  const containerHeight = sliderContainer.value.clientHeight;

  // console.log(index, activeSlide.value, slidesCount.value);
  // console.log(
  //   containerHeight,
  //   containerHeight * 0.8,
  //   sliderContainer.value.scrollTop
  // );

  sliderTrack.value.scrollTo({
    left: index * containerWidth,
    top: index == 0 ? index : -(containerHeight * 0.8 * index),
    behavior: "smooth",
  });

  // Resume autoplay after a delay
  setTimeout(startAutoScroll, scrollInterval);
};

onMounted(() => {
  if (sliderTrack.value) {
    slidesCount.value = sliderTrack.value.children.length;
    sliderTrack.value.addEventListener("scroll", checkActiveSlide);
    startAutoScroll();
  }
});

onUnmounted(() => {
  pauseAutoScroll();
  if (sliderTrack.value) {
    sliderTrack.value.removeEventListener("scroll", checkActiveSlide);
  }
});

defineExpose({
  activeSlide,
  slidesCount,
  goToSlide,
});
</script>

<style scoped lang="scss">
.slider-controls {
  @apply flex justify-center gap-2 absolute bottom-5 left-0 right-0 xmd:hidden;
  span {
    @apply h-2 w-2 rounded-full transition-colors duration-300;
  }
}

.content {
  @apply xmd:hidden absolute top-0 left-0 right-0;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(14, 14, 14, 0.42) 0%,
    rgba(0, 0, 0, 0) 100%
  );
}

.slider-component {
  @apply h-md xmd:h-a lg:h-90 max-xmd:bg-red-600 relative overflow-hidden;
  .slider-images {
    @apply overflow-hidden hide-scrollbar [&::-webkit-scrollbar]:hidden flex h-full snap-x snap-mandatory xmd:flex-col-reverse xmd:snap-y;
  }
  img {
    @apply min-w-full h-full object-cover object-center snap-start xmd:max-h-70 xmd:rounded-15;
  }
}
</style>
