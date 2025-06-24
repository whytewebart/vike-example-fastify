<template>
  <UserProfile class="bk-col-min" />
  <section id="about-me" class="bk-col-max md:bk-col-full mt-8 tracking-tight relative">
    <!-- <div class="h-5 absolute left-0 right-0 top--5 mx-10 overflow-y-visible" border="2 gray b-0 dashed" flex="~ justify-center items-start">
    </div> -->

    <div grid="~ md:cols-2 gap-3" class="bio-2">
      <div class="bg-transparent!" flex="~ col gap-2">
        <p class="font-medium about-heading tracking-tighter">
          Full-stack software engineer and visual designer specializing in
          internal tools and dynamic web experiences.
        </p>

        <div class="max-md:hidden divide-x-2 bg-stone-100 h-full" flex="~ items-start">
          <Button label="Languages" severity="secondary" pt:root="rounded-none shadow-reflect" />
          <Button label="Projects" severity="secondary" pt:root="rounded-none" />
        </div>
      </div>
      <div class="space-y-4">
        <p class="font-medium">
          Hi, I’m Emmanuel — I design, build, and maintain <strong> end-to-end digital products</strong> that integrate seamlessly with next-gen tooling.
        </p>
        <h3 class="font-medium tracking-tight text-2xl text-neutral-800">
          Tech & Tools
        </h3>

        <div relative>
          <div
            class="hidden md:block absolute top-3 left-1 h-[calc(100%_-_1.5rem)] w-3"
            border="2 neutral-9 r-0"
          ></div>
          <ul
            class="md:pl-7 text-neutral-700 max-md:list-disc-inside font-medium"
          >
            <li>
              Full-stack software development (frontend, backend, devops)
              <div relative>
                <div
                  class="absolute top-3 left-0 h-[calc(100%_-_1.5rem)] w-3"
                  border="2 neutral-3 r-0"
                ></div>
                <ul class="pl-6 text-neutral-500 font-medium">
                  <li>Node Js, Fastify, Vite</li>
                  <li>Rust, Golang, PHP, Bun</li>
                  <li>PHP, Laravel</li>
                  <li>HTML, CSS, SASS, ES6</li>
                  <li>Wordpress, Wix Studio, Webflow</li>
                  <li>React, Vue, Solid</li>
                  <li>Vite, Webpack</li>
                </ul>
              </div>
            </li>
            <li>Native iOS & Android apps (Swift, Java, Kotlin)</li>
            <li>Cross-platform apps (React Native, Capacitor)</li>
            <li>UI/UX and interaction design</li>
            <li>Visual branding and graphic design</li>
            <li>Debugging, optimization & long-term maintenance</li>
          </ul>
        </div>

        <p>
          My approach is structured, collaborative, and reliable — because good
          software isn’t just built, it’s shaped with intent and care.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style lang="scss">
h3 {
  text-shadow: 0.3px 0.3px 0px black;
}

.bio {
  & > * {
    --at-apply: border-gray border-t border-dashed py-2;
    &:nth-child(even) {
      --at-apply: border-l pl-4;
    }
  }
}

.bio-2 {
  & > div:last-child > *:not(:first-child) {
    --at-apply: sm:border-t sm:pt-4;
  }
}

.about-heading {
  // font-size: clamp(24px, 5vw + 2rem, 48px);
  font-size: clamp(24px, 5vw + .3rem, 48px);
  line-height: 1em;
}
</style>
