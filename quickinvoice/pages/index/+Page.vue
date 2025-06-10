<template>
  <editor-wrapper class="bk-col-nav [contain:content">
    <editor-canvas> </editor-canvas>
  </editor-wrapper>

  <div class="bk-col-nav editor-container relative hidden!">
    <!-- Editor -->
    <div class="panels-wrapper">
      <div class="panels">
        <!-- Blocks -->
        <div class="blocks bg-green h-3xl"></div>
        <!-- Customization -->
        <div class="customize bg-yellow h-3xl"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
#view-content {
  all: unset;
}

html,
body {
  --at-apply: app-scrollbar;
  &::-webkit-scrollbar-track {
    --at-apply: bg-gray-200;
  }

  &::-webkit-scrollbar-button {
    --at-apply: bg-red;
  }
}

:not(:defined) {
  visibility: hidden;
}

.editor-container {
  display: grid;
  // grid-template-columns: 1fr 21rem 21rem;
  // grid-template-columns: auto 1fr;
  --at-apply: b-y-1 app-scrollbar @container / editor bg-red-100;

  div {
    &.panels-wrapper {
      --at-apply: grid @container / panelshello w-full;
    }
    &.panels {
      --at-apply: grid b-l divide-y min-w-21rem;
    }
    &.panels > div {
      --at-apply: ;
    }
  }
}
@container panelshello (min-width: 30rem) {
  div.panels {
    --at-apply: cols-2 divide-x divide-y-0;
  }
}
</style>
