<template>
  <div class="bk-col-nav editor-container relative">
    <!-- Editor -->
    <editor-wrapper>
      <editor-canvas></editor-canvas>
    </editor-wrapper>
     <!-- <div class="editor relative!">
     </div> -->
     <!-- Blocks -->
     <div class="blocks"></div>
     <!-- Customization -->
     <div class="customize"></div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
#view-content {
  all: unset;
}

:not(:defined) {
  visibility: hidden;
}

.editor-container {
  display: grid;
  // grid-template-columns: 1fr 21rem 21rem;

  --at-apply: divide-x b-y-1 app-scrollbar;
  div {
    --at-apply: h-full w-full;
    &:not(.editor) {
      --at-apply: bg-white;
    }

    &.editor {
      display: grid;
      justify-items: center;
      align-items: center;

      position: sticky;
      top: 0;

      --at-apply: py-12 px-5 hide-scrollbar overflow-auto;
    }
  }
}
</style>
