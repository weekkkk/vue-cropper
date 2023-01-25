<script lang="ts" setup>
import {
  type PropType,
  ref,
  nextTick,
  computed,
  onUnmounted,
  reactive,
  onMounted,
} from 'vue';
import { Color } from '../enums';
import { Position } from './enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Позиция
   */
  position: { type: String as PropType<Position>, default: Position.Bottom },
  /**
   * * Цвет
   */
  color: { type: String as PropType<Color>, default: Color.Default },
  /**
   * * Ширина
   */
  width: { type: String, default: 'auto' },
  /**
   * * Классы
   */
  classes: { type: String, default: '' },
  /**
   * * Режим тултипа
   */
  tooltip: { type: Boolean, default: false },
});
/**
 * * События
 */
const emit = defineEmits<{
  (e: 'open', target: HTMLElement): void;
  (e: 'close', target: HTMLElement): void;
  (e: 'focus', target: HTMLElement): void;
  (e: 'blur', target: HTMLElement): void;
}>();
/**
 * * Видимость
 */
const visible = ref(false);
/**
 * * Элемент
 */
const $element = ref<HTMLElement>();
/**
 * * Поповер
 */
const $content = ref<HTMLElement>();
/**
 * * Внутри
 */
const $inner = ref<HTMLElement>();
/**
 * * Треугольник
 */
const $triangle = ref<HTMLElement>();
/**
 * * Координаты поповера
 */
const content = reactive({ x: 0, y: 0 });
/**
 * * Координаты треугольника
 */
const triangle = reactive({ x: 0, y: 0 });
/**
 * * Позиция
 */
const _position = ref(props.position);
/**
 * * Клик по элементу
 */
function focus() {
  if (visible.value && !props.tooltip) close();
  else {
    if (visible.value) return;
    open();
    if (!$element.value) return;
    emit('focus', $element.value);
  }
}

/**
 * * Высчитать позицию
 */
function calc(
  p: Position,
  about: DOMRect,
  rect: DOMRect,
  i = 0
): { x: number; y: number; position: Position } {
  const bw = getComputedStyle(document.documentElement)
    .getPropertyValue('--n-popover-tr')
    .replace('px', '');
  const br = getComputedStyle(document.documentElement)
    .getPropertyValue('--n-popover-br')
    .replace('px', '');
  const min = Number(bw) * 2 + Number(br);
  const settings = { x: 0, y: 0, position: p };
  const ignore = i == 4;
  if (ignore) {
    const indets = [
      about.left,
      window.innerWidth - about.right,
      about.top,
      window.innerHeight - about.bottom,
    ];
    switch (indets.indexOf(Math.max(...indets))) {
      case 0:
        p = Position.Left;
        break;
      case 1:
        p = Position.Right;
        break;
      case 2:
        p = Position.Top;
        break;
      case 3:
        p = Position.Bottom;
        break;
    }

    console.error('ignore', { i, p });
    settings.position = p;
  }

  switch (p) {
    case Position.Top:
      settings.x = about.left + about.width / 2 - rect.width / 2;
      settings.y = about.top - rect.height;

      if (settings.x < 0) settings.x = 0;
      else if (settings.x + rect.width > window.innerWidth)
        settings.x = window.innerWidth - rect.width;

      if (
        !ignore &&
        (settings.y < 0 ||
          about.right - window.innerWidth >= about.width / 2 - min ||
          about.left <= -about.width / 2 + min)
      )
        return calc(Position.Right, about, rect, i + 1);
      break;
    case Position.Left:
      settings.y = about.top + about.height / 2 - rect.height / 2;
      settings.x = about.left - rect.width;

      if (settings.y < 0) settings.y = 0;
      else if (settings.y + rect.height > window.innerHeight)
        settings.y = window.innerHeight - rect.height;

      if (
        !ignore &&
        (settings.x < 0 ||
          about.bottom - window.innerHeight >= about.height / 2 - min ||
          about.top <= -about.height / 2 + min)
      )
        return calc(Position.Top, about, rect, i + 1);
      break;
    case Position.Right:
      settings.y = about.top + about.height / 2 - rect.height / 2;
      settings.x = about.right;

      if (settings.y < 0) settings.y = 0;
      else if (settings.y + rect.height > window.innerHeight)
        settings.y = window.innerHeight - rect.height;

      if (
        !ignore &&
        (settings.x + rect.width > window.innerWidth ||
          about.bottom - window.innerHeight >= about.height / 2 - min ||
          about.top <= -about.height / 2 + min)
      )
        return calc(Position.Bottom, about, rect, i + 1);
      break;
    case Position.Bottom:
      settings.x = about.left + about.width / 2 - rect.width / 2;
      settings.y = about.bottom;

      if (settings.x < 0) settings.x = 0;
      else if (settings.x + rect.width > window.innerWidth)
        settings.x = window.innerWidth - rect.width;

      if (
        !ignore &&
        (settings.y + rect.height > window.innerHeight ||
          about.right - window.innerWidth >= about.width / 2 - min ||
          about.left <= -about.width / 2 + min)
      )
        return calc(Position.Left, about, rect, i + 1);
      break;
    case Position.Auto:
      return calc(Position.Top, about, rect);
  }
  return settings;
}
/**
 * * Инициализация позиций элементов
 */
async function init() {
  await nextTick();
  if (!$element.value || !$content.value) return;

  const elementRect = $element.value.getBoundingClientRect();

  const contentRect = $content.value.getBoundingClientRect();
  const contentSettings = calc(props.position, elementRect, contentRect);
  content.x = contentSettings.x;
  content.y = contentSettings.y;
  _position.value = contentSettings.position;

  await nextTick();
  if (!$triangle.value) return;
  const triangleRect = $triangle.value.getBoundingClientRect();
  const triangleSettings = calc(_position.value, elementRect, triangleRect);
  triangle.x = triangleSettings.x;
  triangle.y = triangleSettings.y;
}
/**
 * * При загрузке компонента
 */
onMounted(() => {
  if (!$element.value || !props.tooltip) return;
  $element.value.addEventListener('mouseover', focus);
});
/**
 * * Открыть
 */
async function open() {
  if (visible.value) return;
  visible.value = true;
  await init();
  window.addEventListener('click', click);
  if (props.tooltip && $element.value && $inner.value) {
    $element.value.addEventListener('mouseout', mouseout);
    $inner.value.addEventListener('mouseout', mouseout);
  }
  await nextTick();
  if ($inner.value) emit('open', $inner.value);
}
/**
 * * Закрыть
 */
function close() {
  if (!visible.value) return;
  visible.value = false;
  window.removeEventListener('click', click);
  if (props.tooltip && $element.value && $inner.value) {
    $element.value.removeEventListener('mouseout', mouseout);
    $inner.value.removeEventListener('mouseout', mouseout);
  }
  if (!$inner.value) return;
  emit('close', $inner.value);
}
/**
 * * Убрать фокус
 */
function blur(target: HTMLElement) {
  if (
    !target ||
    !$inner.value ||
    $inner.value == target ||
    $inner.value.contains(target) ||
    !$element.value ||
    $element.value == target ||
    $element.value.contains(target) ||
    !$triangle.value ||
    $triangle.value == target ||
    $triangle.value.contains(target)
  )
    return;
  emit('blur', target);
  close();
}
/**
 * * Блюр щелчком
 */
function click(e: Event) {
  const target = e.target as HTMLElement;
  blur(target);
}
/**
 * * Блюр наведением
 */
function mouseout(e: MouseEvent) {
  const target = e.relatedTarget as HTMLElement;
  blur(target);
}
/**
 * * При разрушении компонента
 */
onUnmounted(close);
/**
 * * Поделиться с родителем
 */
defineExpose({
  open,
  close,
});
/**
 * * Цвет
 */
const _color = computed((): string => {
  const prefix = '--n-';
  const postfix = props.color == Color.Second ? '-100' : '';
  return `var(${prefix}${props.color}${postfix})`;
});
</script>

<template>
  <div class="n-popover_element bg-second-40" ref="$element" @click="focus">
    <Teleport to="body">
      <Transition name="n-popover_animation">
        <div
          class="n-popover_container"
          :style="{
            '--n-popover-c': _color,
          }"
          v-if="visible"
        >
          <div
            ref="$triangle"
            class="n-popover_triangle"
            :class="[_position, color]"
            :style="{ left: `${triangle.x}px`, top: `${triangle.y}px` }"
          />
          <div
            ref="$content"
            class="n-popover_content"
            :style="{ left: `${content.x}px`, top: `${content.y}px` }"
          >
            <div
              ref="$inner"
              class="inner"
              :class="[_position, color]"
              :style="{
                width,
              }"
            >
              <slot name="content" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <slot />
  </div>
</template>

<style lang="scss">
:root {
  --n-popover-c: var(--n-default);
  --n-popover-tr: 4px;
  --n-popover-br: 8px;
  --n-popover-sh: 0 0 calc(var(--n-popover-tr) * 2);
  --n-popover-ts: 0.15s ease-in-out;
}
</style>

<style lang="scss" scoped>
$color: var(--n-popover-c);
$shadow: var(--n-popover-sh) + $color;
$triangle: var(--n-popover-tr);
$radius: var(--n-popover-br);
$min: calc($triangle * 2 + $radius * 2);
$transition: var(--n-popover-ts);

.n-popover {
  &_element {
    display: inline-flex;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }

  &_content {
    position: fixed;
    padding: $triangle;
    color: var(--n-default);

    .inner {
      background-color: $color;
      box-shadow: $shadow;
      border-radius: $radius;
      min-height: $min;
      min-width: $min;

      &.default {
        box-shadow: var(--n-popover-sh) var(--n-base);
        color: var(--n-base);
      }
    }
  }

  &_triangle {
    position: fixed;
    max-height: 0;
    max-width: 0;
    border-style: solid;
    border-color: transparent;
    z-index: 1;
    border-width: $triangle;

    &.top {
      border-top-color: $color;
      border-bottom-width: 0;
    }

    &.bottom {
      border-top-width: 0;
      border-bottom-color: $color;
    }

    &.left {
      border-right-width: 0;
      border-left-color: $color;
    }

    &.right {
      border-left-width: 0;
      border-right-color: $color;
    }
  }

  &_container {
    position: absolute;
    z-index: 1000;
  }

  &_animation-enter-active,
  &_animation-leave-active {
    transition: $transition;
  }

  &_animation-enter-from,
  &_animation-leave-to {
    opacity: 0;
  }
}
</style>
