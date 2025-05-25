<template>
  <section data-section="hero-section" grid="~">
    <div
      class=" font-[Instrument_Sans] font-medium space-y-2 pb-5 grid justify-items-start"
    >
      <p class="text-sm text-red-400 xmd:hidden">
        Worthy Heir of Baron Philippe De Rothschild in Chile
      </p>
      <div xmd="flex justify-between items-end w-full">
        <h2
          class="text-2xl font-[Instrument_Sans] tracking-tighter xmd:tracking-tight font-medium leading-tight"
          xmd="max-w-sm text-sm"
        >
          Escudo Rojo Gran Reserva holds out the promise of the refined and
          elegant expression of French and native grape varieties rooted in the
          Chilean terroirs.
        </h2>

        <div class="hidden lg:flex justify-center gap-2">
          <span
            v-for="(_, index) in sliderComp?.slidesCount"
            :key="index"
            :class="{
              'bg-red-500': sliderComp?.activeSlide === index,
              'bg-gray': sliderComp?.activeSlide !== index,
            }"
            class="h-2 w-2 rounded-full transition-colors duration-300"
            @click="sliderComp?.goToSlide(index)"
          ></span>
        </div>
      </div>
      <h3
        class="font-[Instrument_Sans] text-gray font-normal leading-snug xmd:hidden"
      >
        Its sober and elegant wood and steel architecture reflects the
        combination of the latest technology with the great French winemaking
        tradition.
      </h3>
      <h1 class="font-[Instrument_Serif] font-bold text-6xl text-red-7 xmd:order-first">The Worthy Heir</h1>
      <Button
        label="Get to know our Wines"
        icon="i-solar-arrow-right-outline text-xl!"
        icon-pos="right"
        text
        severity="danger"
        pt:root="xmd:hidden"
      />
    </div>
    <Slider ref="sliderComp" class="xmd: xmd:order-first" />
    <div
      grid="~ xmd:cols-2 lg:cols-3 xmd:gap-y-2 gap-x-2"
      xmd="py-2 "
      max-xmd="divide-x-none divide-y divide-red"
    >
      <Button
        label="Our Expertise"
        size="large"
        severity="secondary"
        :pt="{
          root: 'bg-white rounded-2xl py-3! xmd:py-5! hover:bg-red-100! max-xmd:rounded-none!',
          label: 'font-[Instrument_Serif] font-semibold text-red-500 text-2xl',
        }"
      />
      <Button
        label="Baron Philippe De Rothschild in Chile"
        size="large"
        severity="secondary"
        :pt="{
          root: 'bg-white rounded-2xl py-3! xmd:py-5! hover:bg-red-100! max-xmd:rounded-none!',
          label: 'font-[Instrument_Serif] font-semibold text-red-500 text-2xl',
        }"
      />
      <Button
        label="Escudo Rojo"
        size="large"
        severity="secondary"
        :pt="{
          root: 'bg-white rounded-2xl py-3! xmd:py-5! hover:bg-red-100! max-xmd:rounded-none! xmd:col-span-2 lg:col-span-1',
          label: 'font-[Instrument_Serif] font-semibold text-red-500 text-2xl',
        }"
      />
    </div>
  </section>

  <section
    data-section="crafting-excellence"
    grid="~  xmd:cols-[minmax(0,_36rem)_auto] gap-4"
  >
    <div grid="~ gap-y-4 justify-items-start">
      <h2 class="text-5xl text-red-700 font-[Instrument_Serif] font-bold">Crafting Excellence since 1999</h2>
      <p class="font-normal leading-snug text-gray">
        Born from the esteemed Baron Philippe de Rothschild legacy, Escudo Rojo
        represents a bold venture: bringing the meticulous art of Bordeaux
        winemaking to the fertile lands of Chile.
      </p>
      <p
        class="text-2xl font-[Instrument_Sans] tracking-tighter font-medium leading-tight"
      >
        Since 1999 we have dedicated ourselves to crafting wines that express
        the richness of Chilean terroir while upholding the Baron Philippe de
        Rothschild standard of quality and sophistication.
      </p>
      <p class="font-normal leading-snug text-gray">
        It is a story of tradition, innovation, and a deep respect for the land.
      </p>
      <Button
        label="Discover Our Full Story"
        icon="i-solar-arrow-right-outline text-xl!"
        icon-pos="right"
        text
        pt:root="p-0!"
        severity="danger"
      />
      <Button
        label="Sustainable Development Policy"
        icon="i-solar-arrow-right-outline text-xl!"
        icon-pos="right"
        text
        pt:root="p-0!"
        severity="danger"
      />
    </div>

    <img
      src="./assets/Baroness Philippine de Rothschild.webp"
      width="410"
      height="410"
      class="m-[0_auto]"
      alt=""
    />
  </section>

  <section data-section="wines" class=" py-10 space-y-8">
    <h3 class="font-normal leading-snug text-gray font-[Instrument_Sans]">
      Discover Our Distinguished Collection
    </h3>

    <div grid="~ cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-3">
      <SingleWine v-for="wine in wineJson.slice(0, 5)" :wine />
    </div>
    <Button
      label="View all wines"
      icon="i-solar-arrow-right-outline text-xl!"
      icon-pos="right"
      text
      pt:root="p-0!"
      severity="danger"
    />
  </section>

  <section
    data-section="our vineyards"
    class=""
    grid="~  xmd:cols-[minmax(0,_24rem)_1fr] gap-4 gap-y-12 items-start"
  >
    <div grid="~ gap-y-6 justify-items-start">
      <h3
        class="text-2xl font-[Instrument_Sans] tracking-tighter font-medium leading-tight"
      >
        Our wines are born from carefully selected vineyards across Chile's most
        renowned valleys – Puente Alto, Maipo, Casablanca, Colchagua, and Maule.
        <br />
        <br />

        Each region offers unique climatic conditions and soil types, providing
        the perfect canvas for specific grape varietals.
      </h3>
      <p class="font-normal font-[Instrument_Sans] leading-snug text-gray">
        We believe that great wine starts in the vineyard, and our commitment to
        sustainable practices ensures the health and vitality of our land for
        generations to come.
      </p>
      <div grid="~ gap-y-2 justify-items-start">
        <Button
          label="Explore Our Vineyards"
          icon="i-solar-arrow-right-outline text-xl!"
          icon-pos="right"
          text
          pt:root="p-0!"
          severity="danger"
        />
        <Button
          label="Chile: A genuine winemaking paradise"
          icon="i-solar-arrow-right-outline text-xl!"
          icon-pos="right"
          text
          pt:root="p-0!"
          severity="danger"
        />
      </div>

      <!-- <div xmd="h-33"></div> -->
    </div>
    <img
      src="./assets/f1d426ed7edb9d256ab20ed7fa084fc2d4410fff.webp"
      alt=""
      class="bg-gray-100 min-h-md max-h-xl w-full rounded-tl-40 object-cover"
    />
  </section>
  <Footer />
</template>

<script lang="tsx" setup>
import Slider from "./components/Slider.vue";
import SingleWine from "./components/SingleWine.vue";
import Footer from "./components/Footer.vue";
import { escudoWines as wineJson } from "./wines";

const sliderComp = ref();
</script>

<style>

</style>
