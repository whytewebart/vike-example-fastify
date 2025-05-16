<template>
  <div class="bk-col-root viewport min-h-screen -mt-5 py-5 relative">
    <Header />

    <div
      class="bk-col-min bk-inherit sm:mt-25 mb-4xl z-1 dark"
      flex="~ col sm:items-center gap-3"
    >
      <h1 class="sm:text-center text-neutral-50 font-medium heading--text">
        A Clear Path to a Reliable Product
      </h1>
      <p
        class="sm:text-center font-medium tracking-tighter leading-5 text-neutral-100 text-base max-w-sm"
      >
        A thoughtful, technical process — from first contact to final polish —
        focused on clarity, simplicity, and long-term reliability.
      </p>
    </div>

    <img
      src="./assets/background.webp"
      class="w-full min-h-screen sm:max-h-3xl object-cover absolute top-0 left-0 right-0 bk-col-root"
      alt=""
    />

    <div
      class="overlay w-full h-full max-h-3xl absolute top-0 right-0 left-0 bg-black/30 bk-col-root"
    ></div>

    <div class="my-process bk-col-nav z-1" grid="~ md:cols-2 gap-y-6 gap-x-4">
      <Process
        v-for="process in data.process"
        :key="process.step"
        :step="process.step"
        :subtitle="process.subtitle"
        :description="process.description"
        :powerPhrases="process.powerPhrases"
        :timeline="process.timeline"
        :icon="process.icon"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { SetupContext } from "vue";
import Header from "./components/Header.vue";
import { process } from "./process-json";

const data = ref({
  process,
});

const exports_ = import.meta.glob("./assets/*.webp", {
  eager: true,
  import: "default",
  // query: "?extractExportNames",
});

const processIcons = Object.values(exports_) as string[];
function getMatchingImagePath(name:string) {
  return processIcons.find(path => {
    const filename = path.split('/').pop()?.split('.')[0];
    return filename === name;
  });
}

const Process = (props: (typeof data.value.process)[0], ctx: SetupContext) => {
  return (
    <div class="min-h-sm bg-white p-4.5 rounded-3xl shadow-md flex flex-col gap-2">
      <p class="text-sm tracking-tight font-medium">{props.subtitle}</p>
      <h3 class="text-2xl font-medium tracking-tight text-neutral-800">
        {props.step}
      </h3>
      <p class="text-sm tracking-tight max-w-sm">{props.description}</p>
      <img
        src={getMatchingImagePath(props.icon)}
        alt=""
        width="244px"
        height="244px"
      />
      <p class="text-sm tracking-tight font-medium">
        {props.powerPhrases.join(", ")}
      </p>
      <p class="text-lg text-neutral-800 tracking-tight font-medium">
        {props.timeline}
      </p>
    </div>
  );
};
</script>

<style lang="scss">
.heading--text {
  /* TEXT CLAMP FROM 45px to 60px */
  font-size: clamp(35px, 5vw + 1rem, 60px);
  line-height: 1em;
  letter-spacing: -0.07em;
}

.my-process {
  & > div {
    box-shadow: 0px 8px 0px 0px #1780e3;
  }
}
</style>
