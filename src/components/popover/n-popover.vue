<script lang="ts" setup>
import
{
  type PropType, ref, nextTick, computed, onUnmounted, reactive,
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
function click ()
{
  if (visible.value)
    close();
  else
  {
    open();
    if (!$element.value) return;
    emit('focus', $element.value);
  }
}
/**
 * * Высчитать позицию
 */
function calc (p: Position, about: DOMRect, rect: DOMRect, i = 0): { x: number, y: number; position: Position; }
{
  const bw = getComputedStyle(document.documentElement).getPropertyValue('--n-popover-tr').replace('px', '');
  const br = getComputedStyle(document.documentElement).getPropertyValue('--n-popover-br').replace('px', '');
  const min = Number(bw) * 2 + Number(br);
  const settings = { x: 0, y: 0, position: p };
  const ignore = i == 4;
  if (ignore)
  {
    const indets = [
      about.left,
      window.innerWidth - about.right,
      about.top,
      window.innerHeight - about.bottom
    ];
    switch (indets.indexOf(Math.max(...indets)))
    {
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

  switch (p)
  {
    case Position.Top:
      settings.x = about.left + about.width / 2 - rect.width / 2;
      settings.y = about.top - rect.height;

      if (settings.x < 0)
        settings.x = 0;
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

      if (settings.y < 0)
        settings.y = 0;
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

      if (settings.y < 0)
        settings.y = 0;
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

      if (settings.x < 0)
        settings.x = 0;
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
async function init ()
{
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
 * * Открыть
 */
async function open ()
{
  visible.value = true;
  await init();
  window.addEventListener('click', blur);
  await nextTick();
  if ($content.value)
    emit('open', $content.value);
}
/**
 * * Закрыть
 */
function close ()
{
  visible.value = false;
  window.removeEventListener('click', blur);
  if (!$content.value) return;
  emit('close', $content.value);
}
/**
 * * Убрать фокус
 */
function blur (e: Event)
{
  const target = e.target as HTMLElement;
  if (!target ||
    !$content.value || $content.value == target || $content.value.contains(target) ||
    !$element.value || $element.value == target || $element.value.contains(target) ||
    !$triangle.value || $triangle.value == target || $triangle.value.contains(target)) return;
  emit('blur', target);
  close();
}
/**
 * * При разрушении компонента
 */
onUnmounted(() =>
{
  console.log('onUnmounted');
  close();
});
/**
 * * Поделиться с родителем
 */
defineExpose({
  open,
  close
});
/**
 * * Цвет
 */
const _color = computed((): string =>
{
  const prefix = '--n-';
  const postfix = props.color == Color.Second ? '-100' : '';
  return `var(${ prefix }${ props.color }${ postfix })`;
}
);
</script>

<template>
  <div class="n-popover_element bg-second-40" ref="$element" @click="click">
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
