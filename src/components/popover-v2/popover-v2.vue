<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  useSlots,
  watch,
} from 'vue';
import { popover } from './directive';
import type { EPosition } from './enums';
import type { TPosition } from './types';

import {
  findParentWithScroll,
  getOffsetByParent,
  setScrollListener,
  removeScrollListener,
} from './utils';

const props = defineProps<{
  position: TPosition | 'auto';
}>();

const slots = useSlots();

const el = computed(() => {
  if (!slots.default) return;
  return slots.default()[0];
});

const $el = ref<HTMLElement>();
const $popover = ref<HTMLElement>();

const $verticalParent = ref<HTMLElement>();
const $horizontalParent = ref<HTMLElement>();

const test = () => {
  if (!$el.value || !$popover.value) return;

  $el.value.appendChild($popover.value);

  $verticalParent.value = findParentWithScroll($el.value, 'y');
  $horizontalParent.value = findParentWithScroll($el.value, 'x');

  setScrollListener($verticalParent.value, updateYOffsets);
  setScrollListener($horizontalParent.value, updateXOffsets);
};

const updateXOffsets = () => {
  if (!$horizontalParent.value || !$popover.value) return;

  offsetLeft.value = getOffsetByParent(
    $horizontalParent.value,
    $popover.value,
    'left'
  );
  offsetRight.value = getOffsetByParent(
    $horizontalParent.value,
    $popover.value,
    'right'
  );

  // console.log('left', offsetLeft.value, 'right', offsetRight.value);
};
const updateYOffsets = () => {
  if (!$verticalParent.value || !$popover.value) return;

  offsetTop.value = getOffsetByParent(
    $verticalParent.value,
    $popover.value,
    'top'
  );
  offsetBottom.value = getOffsetByParent(
    $verticalParent.value,
    $popover.value,
    'bottom'
  );

  // console.log('top', offsetTop.value, 'bottom', offsetBottom.value);
};

const offsetTop = ref<number>();
const offsetRight = ref<number>();
const offsetBottom = ref<number>();
const offsetLeft = ref<number>();

const getPosition = (
  desiredPosition: TPosition | 'auto' = props.position,
  i = 0
): TPosition => {
  if (
    !$el.value ||
    !$horizontalParent.value ||
    !$verticalParent.value ||
    !$popover.value
  )
    return 'bottom';

  let offset: number | undefined = undefined;
  let position: TPosition = 'top';

  if (i && props.position == desiredPosition) {
    return 'bottom';
  }

  i++;

  console.log(i);

  const elRect = $el.value.getBoundingClientRect();
  const popoverRect = $popover.value.getBoundingClientRect();

  switch (desiredPosition) {
    case 'top':
      if ($verticalParent.value != document.documentElement) {
        const parentRect = $verticalParent.value.getBoundingClientRect();
        offset = elRect.top - popoverRect.height - parentRect.top;
      } else {
        offset = elRect.top - popoverRect.height;
      }
      console.log('offset', offset);

      if (offset && offset < 0) return getPosition('right', i);
      position = 'top';
      break;
    case 'right':
      if ($horizontalParent.value != document.documentElement) {
        const parentRect = $horizontalParent.value.getBoundingClientRect();
        offset = parentRect.right - (elRect.right + popoverRect.width);
      } else {
        offset = window.innerWidth - (elRect.right + popoverRect.width);
      }
      console.log($horizontalParent.value);
      if (offset && offset < 0) return getPosition('bottom', i);
      position = 'right';
      break;
    case 'bottom':
      if ($verticalParent.value != document.documentElement) {
        const parentRect = $verticalParent.value.getBoundingClientRect();
        offset = parentRect.bottom - (elRect.bottom + popoverRect.height);
      } else {
        offset = window.innerHeight - (elRect.bottom + popoverRect.height);
      }
      if (offset && offset < 0) return getPosition('left', i);
      position = 'bottom';
      break;
    case 'left':
      if ($horizontalParent.value != document.documentElement) {
        const parentRect = $horizontalParent.value.getBoundingClientRect();
        offset = elRect.left - popoverRect.width - parentRect.left;
      } else {
        offset = elRect.left - popoverRect.width;
      }
      if (offset && offset < 0) return getPosition('top', i);
      position = 'top';
      break;
    case 'auto':
      return getPosition('top', i);
  }

  return position;
};
const localPosition = ref<TPosition>('bottom');

watch(
  () => {
    return {
      offsetTop: offsetTop.value,
      offsetRight: offsetRight.value,
      offsetBottom: offsetBottom.value,
      offsetLeft: offsetLeft.value,
    };
  },
  () => {
    localPosition.value = getPosition(props.position);
  }
);

onMounted(test);
defineExpose({ test });
</script>

<template>
  <component
    id="element"
    class="element"
    ref="$el"
    style="transform: translateX(0)"
    :is="el"
  />
  <template v-if="false">
    <slot />
  </template>

  <div class="n_popover bg-base br-2 p-3" :class="localPosition" ref="$popover">
    <slot name="content" />
  </div>
</template>

<style lang="scss">
.line {
  width: 10px;
  background: blue;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
.element {
  position: relative;
}

.n_popover {
  position: absolute;
  z-index: 1000;
  width: 100px;
  --n-popover-of-t: 0;
  --n-popover-of-r: 0;
  --n-popover-of-b: 0;
  --n-popover-of-l: 0;

  &.top,
  &.bottom {
    left: 50%;
    transform: translateX(-50%);
  }
  &.left,
  &.right {
    top: 50%;
    transform: translateY(-50%);
  }
  &.top {
    bottom: 100%;
  }
  &.right {
    left: 100%;
  }
  &.bottom {
    top: 100%;
  }
  &.left {
    right: 100%;
  }
}
</style>
