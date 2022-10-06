<template>
  <span class="n-darg" :class="{ 'is-drag': isDrag }" ref="$wrap">
    <slot :style="style"></slot>
  </span>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from "vue";

const props = defineProps({
  limit: { type: Array as PropType<(HTMLElement | undefined)[]>, default: () => [] },
});
/**
 * Обертка
 */
const $wrap = ref<HTMLElement>();
/**
 * Элемент
 */
const $el = ref<HTMLElement>();
/**
 * Родитель
 */
const $parent = ref<HTMLElement>();
/**
 * Начальная позиция
 */
const start = reactive({
  x: 0,
  y: 0,
});
/**
 * Позиция
 */
const position = reactive({
  x: 0,
  y: 0,
});
/**
 * Стили
 */
const style = computed(() => {
  return {
    left: position.x + "px",
    top: position.y + "px",
  };
});
/**
 * Инстанция
 */
const instance = getCurrentInstance();
/**
 * Перетаскивается ли элемент
 */
const isDrag = ref(false);
/**
 * При начале перетаскивания
 */
const onStart = (e: MouseEvent) => {
  if (isDrag.value) return;
  e.preventDefault();
  console.log("onStart");

  isDrag.value = !isDrag.value;
  start.x = e.screenX;
  start.y = e.screenY;
};
/**
 * При перетаскивании
 */
const onDrag = (e: MouseEvent) => {
  if (!isDrag.value) return;
  console.log("onDrag");
  const dx = e.screenX - start.x;
  const dy = e.screenY - start.y;
  position.x += dx;
  position.y += dy;
  start.x = e.screenX;
  start.y = e.screenY;
  // const isMinL = position.x < Number(limit.value?.minL);
  // const isMaxL = position.x > Number(limit.value?.maxL);
  // const isMinT = position.y < Number(limit.value?.minT);
  // const isMaxT = position.y > Number(limit.value?.maxT);
  // if (isMinL) position.x = Number(limit.value?.minL);
  // if (isMaxL) position.x = Number(limit.value?.maxL);
  // if (isMinT) position.y = Number(limit.value?.minT);
  // if (isMaxT) position.y = Number(limit.value?.maxT);
  // if (!isMinL && !isMaxL) start.x = e.screenX;
  // if (!isMinT && !isMaxT) start.y = e.screenY;
};
/**
 * При остановке перетаскивания
 */
const onStop = () => {
  if (!isDrag.value) return;
  isDrag.value = !isDrag.value;
};
/**
 * При загрузке DOM
 */
onMounted(() => {
  $el.value = $wrap.value?.firstElementChild as HTMLElement;
  $parent.value = $wrap.value?.parentElement as HTMLElement;
  $el.value.addEventListener("mousedown", onStart);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", onStop);
});

// const limit = computed(() => {
//   if (!$el.value || !props.limit.length || !props.limit[0]) return;
//   const parentRect = $parent.value?.getBoundingClientRect() || new DOMRect();
//   const limits = props.limit.map((el) => {
//     const elRect = el?.getBoundingClientRect() || new DOMRect();
//     const x = elRect?.x - parentRect?.x;
//     const y = elRect?.y - parentRect?.y;
//     console.log(Number(el?.offsetHeight) - Number($el.value?.offsetHeight));
//     return {
//       minL: x,
//       maxL: x + Number(el?.offsetWidth) - Number($el.value?.offsetWidth),
//       minT: y,
//       maxT: y + Number(el?.offsetHeight) - Number($el.value?.offsetHeight),
//     };
//   });
//   const sort = limits.sort((a, b) => {
//     if (b.minL != a.minL) return a.minL - b.minL;
//     if (b.maxL != a.maxL) return a.maxL - b.maxL;
//     if (b.minT != a.minT) return a.minT - b.minT;
//     if (b.maxT != a.maxT) return a.maxT - b.maxT;
//     return 0;
//   });
//   return sort[0];
// });
// watch(limit, () => {
//   console.log("limit.value", limit.value);
// });
</script>

<style lang="scss" scoped>
.n-darg {
  cursor: grab;
  max-height: 0;
  max-width: 0;
  &.is-drag {
    cursor: grabbing;
  }
}
</style>
