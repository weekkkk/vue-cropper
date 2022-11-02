<script setup lang="ts">
import { ref, computed } from "vue";
import { useDrag } from "@/components/cropper/composables/drager/composables/drag";
const $el = ref<HTMLElement>();
const { x, y } = useDrag($el);
const style = computed(() => {
  if (!$el.value) return {};
  const w = $el.value.offsetWidth / 100;
  const h = $el.value.offsetHeight / 100;
  const tx = x.value / w;
  const ty = y.value / h;
  return {
    transform: `translateX(${tx}%) translateY(${ty}%)`,
  };
});
</script>

<template>
  <i class="n-drag" ref="$el" :style="style">
    <slot></slot>
  </i>
</template>

<style lang="scss" scoped>
.n-drag {
  position: absolute;
  display: inline-flex;
}
</style>
