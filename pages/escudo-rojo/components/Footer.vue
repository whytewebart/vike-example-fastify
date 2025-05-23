<template>
  <footer class="bg-red-800 mt-5 p-5">
    <div flex="~ items-start justify-between">
      <ul class="font-[Instrument_Serif] text-2xl font-semibold text-white">
        <li>The Worthy Heir</li>
        <li>The Sustainable Development</li>
        <li>Our Wines</li>
      </ul>

      <img src="../assets/escudo-rojo-logo-large.svg" alt="" />
    </div>

    <div border="1 white/50" w-full mt-14></div>
    <div class="footer-links">
      <div>
        <h4>Crafting Excellence</h4>
        <ul class="text-gray-100">
          <li>Discover our full story</li>
          <li>Sustainable Development Policy</li>
          <li>Remarkable Terroir</li>
        </ul>
      </div>
      <div>
        <h4>The Worthy Heir</h4>
        <ul class="text-gray-100">
          <li>Baron Philippe De Rothschild in Chile</li>
          <li>Escudo Rojo</li>
          <li>Expertise</li>
        </ul>
      </div>
      <div>
        <h4>The Sustainable Development</h4>
        <ul class="text-gray-100">
          <li>Remarkable Terroir</li>
          <li>Sustainable Development Policy</li>
          <li>Commitments</li>
          <li>Energy Policy</li>
          <li>Certification</li>
          <li>Moderate Drinking</li>
        </ul>
      </div>
      <div>
        <h4>Our Wines</h4>
        <ul class="text-gray-100">
          <li>Baronesa P.</li>
          <li>Baronesa P. - The Vintages</li>
          <li>Escudo Rojo Origine</li>
          <li>Escudo Rojo Gran Reserva</li>
          <li>Escudo Rojo Gran Reserva Varientals</li>
        </ul>
      </div>
    </div>

    <div border="1 white/50" w-full mt-14></div>
    <div grid="~ sm:cols-[1fr_auto] items-start gap-8">
      <div>
        <p class="font-[Instrument_Serif] font-semibold text-white py-3 text-xl">Escudo Rojo on Social Media</p>
        <div flex="~ items-center gap-2" class="[&]:has-[button:hover]:gap-x-4">
          <Button label="Instagram" icon="i-fa6-brands-instagram" :pt="socialBtn" unstyled />
          <Button label="Facebook" icon="i-fa6-brands-square-facebook" :pt="socialBtn" unstyled />
        </div>
      </div>
      <ul class="text-gray-100 text-sm sm:py-3 sm:pl-3 sm:border-l-2 border-white/50" flex="~ items-center gap-4 wrap">
        <li>Contact</li>
        <li>Baron Philippe De Rothschild website</li>
        <li>Legal Notices</li>
        <li>Privacy Policy</li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts" setup>

const socialBtn = {
  root: 'px-3 py-2 flex items-center gap-x-2.5 bg-white! text-black! rounded-none! border-none hover:scale-110',
  label: 'font-[Instrument_Sans]',
  icon: 'text-xl'
}

</script>

<style scoped>
.footer-links {
  @apply: grid max-sm:divide-y sm:divide-x-3 divide-white/50 gap-4;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  & > div {
    @apply: pt-2xl space-y-3 text-white tracking-tight font-medium text-sm leading-4.5 sm:pl-4 first:pl-0 pb-6 font-[Instrument_Sans];
    h4 {
      @apply: font-semibold text-xl font-[Instrument_Serif];
    }
  }
}

ul {
  @apply: space-y-1;
  li {
    @apply: hover:text-red hover:cursor-pointer;
  }
}
</style>
