<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  id: { type: String, default: undefined },
  classes: { type: String, default: '' },
});

const $el = ref<HTMLElement>();
const $grabbing = ref<HTMLElement>();
const rect = ref<DOMRect>();

const $abs = ref<HTMLElement>();

const isDrag = ref(false);
const sx = ref(0);
const sy = ref(0);

const x = ref(0);
const y = ref(0);

const emit = defineEmits<{
  (e: 'start', target: HTMLElement | undefined, id: number): void;
  (e: 'stop', target: HTMLElement | undefined, id: number): void;
  (e: 'enter', target: HTMLElement | undefined, id: number): void;
  (e: 'leave', target: HTMLElement | undefined | undefined, id: number): void;
}>();

const to = ref<HTMLElement>();

function mousedown(e: MouseEvent) {
  if (isDrag.value) return;

  start(e.clientX, e.clientY).then(() => {
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  });
}
function mousemove(e: MouseEvent) {
  if (!isDrag.value) return;

  drag(e.clientX, e.clientY);
}
function mouseup(e: MouseEvent) {
  if (!isDrag.value) return;

  window.removeEventListener('mousemove', mousemove);
  window.removeEventListener('mouseup', mouseup);

  stop(e.clientX, e.clientY);
}

async function start(cx: number, cy: number) {
  if (isDrag.value || !$el.value) return;

  await nextTick();
  rect.value = $el.value.getBoundingClientRect();

  emit('start', $el.value, Number(props.id));

  sx.value = cx;
  sy.value = cy;

  x.value = sx.value;
  y.value = sy.value;

  isDrag.value = true;
}
function drag(cx: number, cy: number) {
  if (!isDrag.value || !$grabbing.value) return;

  x.value = cx;
  y.value = cy;

  $grabbing.value.style.overflow = 'hidden';
  const el = document.elementFromPoint(x.value, y.value) as HTMLElement;
  $grabbing.value.style.overflow = 'visible';

  if (!el) return;
  const droppable = el.closest('.droppable') as HTMLElement;
  if (droppable && droppable != $el.value) {
    if (droppable != to.value) {
      to.value = droppable;
      emit('enter', to.value, Number(to.value.id));
    }
  } else if (to.value) {
    emit('leave', el, Number((to.value as Element).id));
    to.value = undefined;
  }
}
function stop(cx: number, cy: number) {
  if (!isDrag.value) return;
  if (to.value) emit('stop', $el.value, Number((to.value as Element).id));

  sx.value = 0;
  sy.value = 0;

  x.value = 0;
  y.value = 0;

  isDrag.value = false;
}
</script>

<template>
  <span
    class="n-drag"
    :id="id"
    :class="[classes, { dragged: isDrag }]"
    ref="$el"
    @mousedown.prevent="mousedown"
  >
    <slot />
    <Teleport to="body">
      <span
        v-if="isDrag"
        ref="$grabbing"
        class="n-drag_grabbing"
        :style="{
          top: `calc(${y}px)`,
          left: `calc(${x}px)`,
        }"
      >
        <span
          class="n-drag"
          :class="[classes]"
          :style="{
            width: `${rect?.width}px`,
            height: `${rect?.height}px`,
            left: `calc(${rect?.left}px - ${sx || rect?.left}px)`,
            top: `calc(${rect?.top}px - ${sy || rect?.top}px)`,
          }"
        >
          <slot />
        </span>
      </span>
    </Teleport>
  </span>
</template>

<style lang="scss">
.n-drag {
  display: inline-flex;
  cursor: grab;
  position: relative;
  &.dragged {
    opacity: 0.5;
  }
  &_grabbing {
    display: inline-flex;
    cursor: grabbing;
    position: fixed;
    max-width: 0;
    max-height: 0;
    .n-drag {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0.2;
    }
  }
}
</style>
