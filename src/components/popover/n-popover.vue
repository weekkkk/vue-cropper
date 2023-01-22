<script lang="ts" setup>
import
{
  type PropType, ref, nextTick, computed,
  // watch,
  // onMounted,
  onUnmounted, reactive
} from 'vue';
import { Position } from './enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Позиция
   */
  position: { type: Number as PropType<Position>, default: Position.Bottom }
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
const position = ref(props.position);
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
function calc (p: Position, about: DOMRect, rect: DOMRect): { x: number, y: number; position: Position; }
{
  const settings = { x: 0, y: 0, position: p };

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
        settings.y < 0 ||
        about.right - window.innerWidth >= about.width / 2 ||
        about.left <= -about.width / 2
      )
        return calc(Position.Right, about, rect);
      break;
    case Position.Left:
      settings.y = about.top + about.height / 2 - rect.height / 2;
      settings.x = about.left - rect.width;

      if (settings.y < 0)
        settings.y = 0;
      else if (settings.y + rect.height > window.innerHeight)
        settings.y = window.innerHeight - rect.height;

      if (
        settings.x < 0 ||
        about.bottom - window.innerHeight >= about.height / 2 ||
        about.top <= -about.height / 2
      )
        return calc(Position.Top, about, rect);
      break;

    case Position.Right:
      settings.y = about.top + about.height / 2 - rect.height / 2;
      settings.x = about.right;

      if (settings.y < 0)
        settings.y = 0;
      else if (settings.y + rect.height > window.innerHeight)
        settings.y = window.innerHeight - rect.height;

      if (
        settings.x + rect.width > window.innerWidth ||
        about.bottom - window.innerHeight >= about.height / 2 ||
        about.top <= -about.height / 2
      )
        return calc(Position.Bottom, about, rect);
      break;
    case Position.Bottom:
      settings.x = about.left + about.width / 2 - rect.width / 2;
      settings.y = about.bottom;

      if (settings.x < 0)
        settings.x = 0;
      else if (settings.x + rect.width > window.innerWidth)
        settings.x = window.innerWidth - rect.width;

      if (
        settings.y + rect.height > window.innerHeight ||
        about.right - window.innerWidth >= about.width / 2 ||
        about.left <= -about.width / 2
      )
        return calc(Position.Left, about, rect);
      break;
    case Position.Auto:
      return calc(Position.Top, about, rect);
  }
  return settings;
}
async function init ()
{
  await nextTick();
  if (!$element.value || !$content.value) return;

  const elementRect = $element.value.getBoundingClientRect();

  const contentRect = $content.value.getBoundingClientRect();
  const contentSettings = calc(props.position, elementRect, contentRect);
  content.x = contentSettings.x;
  content.y = contentSettings.y;
  position.value = contentSettings.position;

  await nextTick();
  if (!$triangle.value) return;
  const triangleRect = $triangle.value.getBoundingClientRect();
  const triangleSettings = calc(position.value, elementRect, triangleRect);
  triangle.x = triangleSettings.x;
  triangle.y = triangleSettings.y;

  console.log({ triangleSettings, contentSettings });
}
/**
 * * Открыть
 */
function open ()
{
  visible.value = true;
  init();
  window.addEventListener('click', blur);
  if (!$content.value) return;
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
onUnmounted(close);
/**
 * * Класс позиции
 */
const classes = computed((): string =>
{
  switch (position.value)
  {
    case Position.Top:
      return 'top';
    case Position.Right:
      return 'right';
    case Position.Bottom:
      return 'bottom';
    case Position.Left:
      return 'left';
  }
  return '';
}
);
/**
 * * Поделиться с родителем
 */
defineExpose({
  open,
  close
});
</script>

<template>
  <div class="n-popover_element bg-second-40" ref="$element" @click="click">
    <Teleport to="body">
      <Transition name="n-popover_animation">
        <div class="n-popover_container" v-if="visible">
          <div
            ref="$triangle"
            class="n-popover_triangle"
            :class="classes"
            :style="{ left: `${triangle.x}px`, top: `${triangle.y}px` }"
          />
          <div
            ref="$content"
            class="n-popover_content"
            :class="classes"
            :style="{ left: `${content.x}px`, top: `${content.y}px` }"
          >
            <div class="inner bg-brand">
              <h1 style="height: 200px">Content</h1>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.n-popover {
  &_element {
    display: inline-flex;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }

  &_content {
    position: fixed;
    max-width: 100%;
    max-height: 100%;

    &.top {
      transform: translateY(-4px);
    }

    &.bottom {
      transform: translateY(4px);
    }

    &.left {
      transform: translateX(-4px);
    }

    &.right {
      transform: translateX(4px);
    }
  }

  &_triangle {
    position: fixed;
    max-height: 0;
    max-width: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 8px;

    &.top {
      border-top-color: red;
      border-bottom-width: 0;
    }

    &.bottom {
      border-top-width: 0;
      border-bottom-color: red;
    }

    &.left {
      border-right-width: 0;
      border-left-color: red;
    }

    &.right {
      border-left-width: 0;
      border-right-color: red;
    }
  }

  &_container {
    position: absolute;
  }

  &_animation-enter-active,
  &_animation-leave-active {
    transition: opacity 1s ease;
  }

  &_animation-enter-from,
  &_animation-leave-to {
    opacity: 0;
  }
}
</style>
