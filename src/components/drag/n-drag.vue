<script lang="ts" setup>
import { type PropType, ref, nextTick } from 'vue';

/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * ID элемента
   */
  id: { type: String, default: undefined },
  /**
   * * Классы элемента и его копии
   */
  classes: { type: String, default: '' },
  /**
   * * Классы элемента, при перетаскивании его копии
   */
  dragClass: { type: String, default: '' },
  /**
   * * Классы клона, который перетаскиваем
   */
  grabbingClass: { type: String, default: '' },
  /**
   * * Классы элемента на который дропают текщий
   */
  droppableClass: { type: String, default: '' },
  /**
   * * Классы элементов на который дропается текщий
   */
  droppableClasses: {
    type: Array as PropType<string[]>,
    default: ['droppable'],
  },
});
/**
 * * Элемент
 */
const $el = ref<HTMLElement>();
/**
 * * Клон, который перетаскиваем
 */
const $grabbing = ref<HTMLElement>();
/**
 * * Позиция элемента
 */
const rect = ref<DOMRect>();

/**
 * * Перетаскивается ли элемент
 */
const isDrag = ref(false);
/**
 * * Начальные координаты
 */
const sx = ref(0);
const sy = ref(0);
/**
 * * Текущие координаты курсора
 */
const x = ref(0);
const y = ref(0);
/**
 * * События
 */
const emit = defineEmits<{
  (e: 'start', target: HTMLElement | undefined, id: number): void;
  (e: 'stop', target: HTMLElement | undefined, id: number): void;
  (e: 'enter', target: HTMLElement | undefined, id: number): void;
  (e: 'leave', target: HTMLElement | undefined | undefined, id: number): void;
}>();
/**
 * * Элемент для дропа
 */
const droppable = ref<HTMLElement>();
/**
 * * Перетаскивание мышью
 */
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

/**
 * * Начало перетаскивания
 * @param cx - clientX
 * @param cy - clientY
 */
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
/**
 * * Перетаскивание
 * @param cx - clientX
 * @param cy - clientY
 */
function drag(cx: number, cy: number) {
  if (!isDrag.value || !$grabbing.value) return;

  x.value = cx;
  y.value = cy;

  if (y.value < 0 && window.scrollY > 0) {
    window.scrollTo(0, window.scrollY + y.value);
    y.value = 0;
  } else if (y.value > window.innerHeight) {
    window.scrollTo(0, window.scrollY + (y.value - window.innerHeight));
    y.value = window.innerHeight;
  }

  $grabbing.value.style.overflow = 'hidden';
  const el = document.elementFromPoint(x.value, y.value) as HTMLElement;
  $grabbing.value.style.overflow = 'visible';

  if (!el) return;

  let _droppable: HTMLElement | undefined;
  props.droppableClasses.forEach((cls) => {
    const _el = el.closest(`.${cls}`) as HTMLElement;
    if (_el) {
      _droppable = _el;
    }
  });
  if (_droppable && _droppable != $el.value) {
    if (_droppable != droppable.value) {
      if (droppable.value != _droppable && props.droppableClass)
        droppable.value?.classList.remove(props.droppableClass);
      droppable.value = _droppable;
      if (props.droppableClass) {
        droppable.value?.classList.add(props.droppableClass);
      }
      emit('enter', droppable.value, Number(droppable.value.id));
    }
  } else if (droppable.value) {
    emit('leave', el, Number((droppable.value as Element).id));
    if (props.droppableClass)
      droppable.value?.classList.remove(props.droppableClass);
    droppable.value = undefined;
  }
}
/**
 * * Остановка перетаскивания
 * @param cx - clientX
 * @param cy - clientY
 */
function stop(cx: number, cy: number) {
  if (!isDrag.value) return;
  if (droppable.value)
    emit('stop', $el.value, Number((droppable.value as Element).id));

  sx.value = 0;
  sy.value = 0;

  x.value = 0;
  y.value = 0;

  if (props.droppableClass)
    droppable.value?.classList.remove(props.droppableClass);
  droppable.value = undefined;

  isDrag.value = false;
}
</script>

<template>
  <span
    class="n-drag"
    :id="id"
    :class="[classes, { dragged: isDrag }, isDrag ? dragClass : '']"
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
          :class="[classes, grabbingClass]"
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
    }
  }
}
</style>
