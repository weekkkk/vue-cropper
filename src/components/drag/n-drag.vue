<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useMouse } from "@/composables/mouse";
const props = defineProps({
  offsetEl: { type: HTMLElement, default: null },
  el: { type: HTMLElement, default: null },
});
const $el = ref<HTMLElement>();
const { x, y } = useMouse();
const startX = ref(0);
const startY = ref(0);
const isDrag = ref(false);
const position = reactive({
  x: 0,
  y: 0,
});
function onStart() {
  if (isDrag.value) return;
  isDrag.value = !isDrag.value;
  startX.value = x.value;
  startY.value = y.value;
}
function onStop() {
  if (!isDrag.value) return;
  isDrag.value = !isDrag.value;
}
window.addEventListener("mouseup", onStop);
watch(x, () => {
  if (!isDrag.value || !$el.value) return;
  const parent = $el.value.parentElement;
  if (!parent) return;
  position.x -= startX.value - x.value;
  const maxW = parent.offsetWidth - $el.value.offsetWidth;
  if (position.x < 0) position.x = 0;
  else if (position.x > maxW) position.x = maxW;
  else startX.value = x.value;
});
watch(y, () => {
  if (!isDrag.value || !$el.value) return;
  const parent = $el.value.parentElement;
  if (!parent) return;
  position.y -= startY.value - y.value;
  const maxH = parent.offsetHeight - $el.value.offsetHeight;
  if (position.y < 0) position.y = 0;
  else if (position.y > maxH) position.y = maxH;
  else startY.value = y.value;
});
</script>

<template>
  <span
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    class="n-drag"
    ref="$el"
    @mousedown.prevent="onStart"
  >
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
.n-drag {
  display: inline-grid;
  position: absolute;
}
</style>
