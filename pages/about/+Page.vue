<template>
  <UserProfile class="bk-col-min" />
  <div class="mt-4 bk-col-min hidden">
    <h1 class="text-3xl tracking--.6 font-medium text-neutral-800">
      Hello, I'm Emmanuel
    </h1>
    <p class="text-sm font-semibold">
      Reliable Software Solutions, Built for the Long Term
    </p>
  </div>

  <div
    class="mt-8 bk-col-root min-h-screen-sm bg-accent viewport sm:space-y-18"
  >
    <div
      grid="md:~ cols-[1.3fr_1fr_.5fr] content-between"
      class="py-4 grid-col-[nav]! sticky top-0 z-10 bg-accent"
    >
      <h2 class="text-base tracking-tighter font-medium text-white">
        Emmanuel Godswill
      </h2>

      <p
        class="text-base font-epilogue font-medium tracking-tighter text-white"
      >
        Fullstack Software Developer —
        <span class="text-white/80">Brand Designer</span>
      </p>
      <p
        class="text-base font-epilogue font-medium tracking-tighter text-white/80 md:text-end"
      >
        Portfolio '25
      </p>
    </div>

    <p class="grid-col-[max]! font-medium tracking-tight text-white">
      I’m a freelance developer with 4+ years of experience working across the
      full stack — building, fixing, and maintaining applications of all kinds.
      I’ve worked on large-scale projects and small, focused builds, and I treat
      both with the same level of care. <br /><br />

      <strong
        >My approach is simple: <br />
        — Understand the problem, break it down, and solve it in a way that
        lasts.</strong
      >
      <br />
      That means I pay attention not just to what works today, but what will
      still make sense months or years down the line. I like code that’s clean,
      systems that are easy to extend, and processes that don’t get in the way.
      <br /><br />

      What I value most in client work is clear communication and steady
      progress. I keep things direct, stay available, and check in often —
      because half of good software is just making sure everyone’s on the same
      page. <br /><br />

      You’ll find I’m not the kind of developer who disappears for weeks or
      buries you in technical jargon. I listen closely, explain things clearly,
      and aim to keep the experience straightforward. <br /><br />

      If you're looking for someone to step in, bring structure, and move the
      project forward — I can help.
    </p>

    <div class="projects relative" flex="~ gap-x-2">
      <img
        v-for="clientsrc in myclients"
        :key="clientsrc"
        :src="clientsrc"
        class="w-full h-full object-cover"
        alt=""
      />

      <Button
        label="See All Projects"
        icon="i-solar-arrow-right-outline"
        icon-pos="right"
        severity="secondary"
        pt:root="absolute! z-1 ml-4! justify-between!"
        as="a"
        href="/about"
      />
    </div>

    <div class="grid-col-[nav]! pb-18 pt-26 sm:pt-12">
      <h3 class="tracking-tighter text-white font-medium text-xl">
        Know the fundamentals
      </h3>

      <div border="1 white" w-full mt-4></div>
      <div class="kn-f">
        <div>
          <h4>About Me</h4>
          <p>
            I'm an independent developer with over four years of experience
            building large-scale applications with a focus on simple solutions
            that stand the test of time. I don't just write code — I listen,
            understand, and build around what your project truly needs
          </p>
        </div>
        <div>
          <h4>My Approach</h4>
          <p>
            Software should be simple enough to understand, strong enough to
            grow, and polished enough to last. <br />
            <br />
            Good development isn’t just about writing code — it's about
            identifying the problem, listening carefully, troubleshooting
            thoroughly, breaking things down, simplifying, completing, and
            polishing.
          </p>
        </div>
        <div>
          <h4>Solutions I Offer</h4>
          <ul class="list-disc-inside pl-4">
            <li>Full App Development (Mobile, Web, Desktop)</li>
            <li>Backend Development & APIs</li>
            <li>Server Troubleshooting & Optimization</li>
            <li>UI/UX Enhancements for Existing Projects</li>
            <li>Long-Term Maintenance & Support</li>
          </ul>
          <p>
            Each solution is tailored to the project's real needs — no
            unnecessary complexity, no hidden problems down the line.
          </p>
        </div>
        <div>
          <h4>Branding & Visual Communication</h4>
          <p>
            Strong brands start with strong foundations. Alongside software
            development, I offer branding and graphic design services to help
            new businesses, apps, and personal projects create a professional
            visual identity. <br /><br />
            Whether it’s a startup needing its first logo, an app needing a
            clean visual interface, or a business needing marketing materials —
            I ensure every visual element complements the product behind it.
            <br /><br />
            Services Include:
          </p>
          <ul class="list-disc-inside pl-4">
            <li>Logo Design & Identity Systems</li>
            <li>Brand Style Guidelines</li>
            <li>App & Website Visual Direction</li>
            <li>Marketing Assets (Brochures, Pitch Decks, Social Graphics)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const exports_ = import.meta.glob("../../assets/clients/*.webp", {
  eager: true,
  import: "default",
  // query: "?extractExportNames",
});

const myclients = Object.values(exports_) as string[];
</script>

<style lang="scss">
.projects {
  @apply: space-x--500px justify-center items-center overflow-x-clip grid-col-[root]! relative z-20 pt-20 sm:pt0;
  & > img {
    @apply: min-w-600px h-a bg-gray-200 rotate--25;
  }
}

.kn-f {
  @apply: grid max-sm:divide-y sm:divide-x-2 divide-white gap-4;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  & > div {
    @apply: pt-2xl space-y-3 text-white tracking-tight font-medium text-sm leading-4.5 sm:pl-4 first:pl-0 pb-6;
    h4 {
      @apply: tracking-tighter font-medium text-base;
    }
  }
}
</style>
