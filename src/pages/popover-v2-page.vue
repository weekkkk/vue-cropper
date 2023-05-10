<script lang="ts" setup>
import PopoverV2 from '@/components/popover-v2/popover-v2.vue';
import { ref } from 'vue';

const popover = ref<InstanceType<typeof PopoverV2>>();
</script>

<template>
  <Teleport to="body">
    <button class="test" @click="popover?.test">
      <h1>set</h1>
    </button>
  </Teleport>

  <div id="test" style="height: 1000px"></div>
  <div class="f fd-col" style="overflow: auto; height: 2000px; width: 500px">
    <div style="min-height: 500px; min-width: 1000px"></div>

    <PopoverV2 ref="popover" position="top">
      <div class="f p-2 bg-second-100 br-3" style="height: 200px">
        <span key="1" class="fs-h1 fw-bold c-default p-3 br-3 bg-brand">
          text boxddd
        </span>
      </div>

      <template #content>
        <h1 class="c-default">content</h1>
        <h1 class="c-default">content</h1>
        <h1 class="c-default">content</h1>
        <h1 class="c-default">content</h1>
        <h1 class="c-default">content</h1>
        <h1 class="c-default">content</h1>
      </template>
    </PopoverV2>

    <div style="min-height: 500px; min-width: 1000px"></div>
  </div>
  <div id="test" style="height: 1000px"></div>
</template>

<style lang="scss">
.test {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>
