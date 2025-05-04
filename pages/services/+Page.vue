<template>
  <div
    class="bk-col-min bk-inherit sm:mt-25 mb-4xl"
    flex="~ col sm:items-center gap-3"
  >
    <div sm:hidden>
      <Button
        text
        label="Back to Home"
        icon="i-solar-arrow-left-outline"
        severity="contrast"
        size="small"
        class="w-fit"
        pt:label="flex-none!"
      />
    </div>
    <img src="./assets/code-icon.png" class="w-105px h-a" alt="" />
    <h1 class="sm:text-center text-neutral-900 font-medium heading--text-services">
      Practical Solutions for Real-World Problems
    </h1>
    <p
      class="sm:text-center tracking-tight text-neutral-700 text-base max-w-sm"
    >
      <b>Troubleshooting, building, launching</b> — and establishing a presence
      are not just steps in a process. They’re a pattern that secures the
      future.
    </p>

    <div class="flex max-sm:flex-col gap-3 w-full max-w-lg">
      <Button
        label="Start Project"
        severity="info"
        size="large"
        pt:label="text-xl font-medium! tracking-tighter font-epilogue"
        pt:root="bg-accent! rounded-xl!"
        fluid
      />
      <Button
        label="Troubleshoot My App"
        severity="secondary"
        size="large"
        pt:label="text-xl font-medium! tracking-tighter text-accent! font-epilogue"
        pt:root="bg-white! rounded-xl! b-none!"
        fluid
      />
    </div>
  </div>

  <p class="text-base tracking-tight bk-col-max font-medium">
    I don’t just write code — I help you figure out what’s not working, what’s
    possible, and how to build something that lasts. Whether you’re starting
    from scratch or fixing something that’s gone off-track, I aim to keep things
    simple, clear, and maintainable. No fluff — just solid, reliable work.
  </p>

  <div class="my-services">
    <template v-for="{ title, description } in services" :key="title">
      <p>
        <span>{{ title }}</span>
      </p>
      <p>{{ description }}</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
const services = [
  {
    title: "Troubleshooting & Debugging",
    description:
      "I help diagnose and resolve issues across frontend, backend, or infrastructure. That includes broken features, server errors, database issues, and bugs that are hard to reproduce. The goal is to get things working properly again, without creating new problems in the process.",
  },
  {
    title: "Application Development (Web, Mobile, Desktop)",
    description:
      "I build full-stack applications tailored to specific needs — from business tools to customer-facing apps. This includes setting up the architecture, designing how data flows, creating interfaces, and ensuring everything works well together. The result is a stable, usable app that can grow with time.",
  },
  {
    title: "Frontend Development & UI Polish",
    description:
      "I handle the design and implementation of interfaces using tools like React, Vue, Tailwind, and others. That includes layout work, accessibility, animations, and fine-tuning interactions so they feel natural. I pay attention to visual consistency and try to make things intuitive for real users.",
  },
  {
    title: "Backend Systems & Integrations",
    description:
      "I develop backend logic that handles things like user accounts, file storage, real-time updates, payments, and external API integrations. Whether it’s building from scratch or improving an existing setup, I focus on keeping things organized and easy to maintain.",
  },
  {
    title: "Server Infrastructure & Deployment",
    description:
      "I set up and troubleshoot environments for staging and production. This covers things like build pipelines, containerization, environment variables, hosting setups, and handling downtime or crashes. I aim to make deployments predictable and recovery straightforward.",
  },
  {
    title: "Website Creation & Rebuilds",
    description:
      "I create websites from the ground up or rebuild outdated ones with a focus on performance, responsiveness, and ease of use. These are usually marketing or business websites, built to be fast and reliable across devices, with just enough structure to grow over time.",
  },
  {
    title: "Ongoing Support & Maintenance",
    description:
      "I provide updates, fixes, and improvements after a project is launched. This includes bug fixes, code cleanups, dependency updates, small feature additions, and general upkeep — especially useful for teams without a dedicated developer on hand.",
  },
];
</script>

<style lang="scss">
.heading--text-services {
  /* TEXT CLAMP FROM 45px to 60px */
  font-size: clamp(35px, 5vw + 1rem, 50px);
  line-height: 1em;
  letter-spacing: -0.07em;
}

.my-services {
  @apply: grid sm:grid-cols-[200px_1fr] bk-col-max mt-8;

  p {
    &:nth-child(odd) {
      @apply: text-xl text-neutral-800 leading-5 font-epilogue font-medium tracking-tighter sm:pr-2;
    }

    &:nth-child(even) {
      @apply: text-base tracking-tight font-medium sm:pl-4 pb-4 sm:b-l-2 b-divider;
    }

    @apply: pt-3 sm:b-t-1 b-divider;
  }
}
</style>
