<script lang="ts" setup>
import { type PropType, ref, nextTick, computed } from 'vue';
import { PositionEnum } from './enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Позиция
   */
  position: { type: Number as PropType<PositionEnum>, default: PositionEnum.Bottom }
});
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
const content = ref({ x: 0, y: 0 });
/**
 * * Координаты треугольника
 */
const triangle = ref({ x: 0, y: 0 });
/**
 * * Позиция
 */
const position = ref(props.position);
/**
 * * Получить координаты поповера
 * @param pos - Позиция
 * @param element - Координаты элемента
 * @param rect - Координаты попвера
 * @param k - Кол-во рекурсий
 */
function getSettings (pos: PositionEnum, element: DOMRect, rect: DOMRect, k = 0): { x: number, y: number; }
{
  console.log('getSettings', pos, k);

  const settings = { x: 0, y: 0 };

  if (pos == PositionEnum.Top || pos == PositionEnum.Bottom)
    settings.x = element.left + element.width / 2 - rect.width / 2;
  else if (pos == PositionEnum.Left || pos == PositionEnum.Right)
    settings.y = element.top + element.height / 2 - rect.height / 2;

  switch (pos)
  {
    case PositionEnum.Top:
      settings.y = element.top - rect.height;
      break;
    case PositionEnum.Bottom:
      settings.y = element.bottom;
      break;
    case PositionEnum.Left:
      settings.x = element.left - rect.width;
      break;
    case PositionEnum.Right:
      settings.x = element.right;
      break;
    case PositionEnum.Auto:
      // position.value = PositionEnum.Top;
      return getSettings(PositionEnum.Top, element, rect, k + 1);
  }

  let right = settings.x + rect.width;
  let bottom = settings.y + rect.height;
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  if (settings.x < 0 && pos != PositionEnum.Left)
    settings.x = 0;
  if (settings.y < 0 && pos != PositionEnum.Top)
    settings.y = 0;
  if (right > ww && pos != PositionEnum.Right)
    settings.x = ww - rect.width;
  if (bottom > wh && pos != PositionEnum.Bottom)
    settings.y = wh - rect.height;

  right = Math.floor(settings.x + rect.width);
  bottom = Math.floor(settings.y + rect.height);

  if ((pos != position.value || k == 0) && (settings.x < 0 || settings.y < 0 || right > ww || bottom > wh))
  {
    if (pos == PositionEnum.Left)
      return getSettings(PositionEnum.Top, element, rect, k + 1);
    else if (pos == PositionEnum.Top)
      return getSettings(PositionEnum.Right, element, rect, k + 1);
    else if (pos == PositionEnum.Right)
      return getSettings(PositionEnum.Bottom, element, rect, k + 1);
    else if (pos == PositionEnum.Bottom)
      return getSettings(PositionEnum.Left, element, rect, k + 1);
  }

  position.value = pos;

  return settings;
}
/**
 * * Клик по элементу
 */
function click ()
{
  console.log('click');
  if (visible.value) close();
  else open();
}
/**
 * * Установить настройки
 */
async function setSettings ()
{
  await nextTick();
  if (!$element.value || !$content.value) return;
  const elementRect = $element.value.getBoundingClientRect();
  const contentRect = $content.value.getBoundingClientRect();
  content.value = getSettings(position.value, elementRect, contentRect);
  await nextTick();
  if (!$triangle.value) return;
  const triangleRect = $triangle.value.getBoundingClientRect();
  triangle.value = getSettings(position.value, elementRect, triangleRect);
}
/**
 * * Открыть
 */
function open ()
{
  console.log('open');
  visible.value = true;
  setSettings();
  window.addEventListener('click', blur);
}
/**
 * * Закрыть
 */
function close ()
{
  console.log('close');
  visible.value = false;
}
/**
 * * Убрать фокус
 */
function blur (e: Event)
{
  const target = e.target as HTMLElement;
  if (!$content.value || $content.value == target || $content.value.contains(target) || !$element.value || $element.value == target || $element.value.contains(target)) return;
  close();
}
/**
 * * Класс позиции
 */
const classes = computed((): string =>
{
  switch (position.value)
  {
    case PositionEnum.Top:
      return 'top';
    case PositionEnum.Right:
      return 'right';
    case PositionEnum.Bottom:
      return 'bottom';
    case PositionEnum.Left:
      return 'left';
  }
  return '';
}
);
</script>

<template>
  <div class="n-popover_element bg-second-40" ref="$element" @click="click">
    <Teleport to="body">
      <div
        ref="$triangle"
        v-if="visible"
        class="n-popover_triangle"
        :class="classes"
        :style="{ left: `${triangle.x}px`, top: `${triangle.y}px` }"
      />
    </Teleport>
    <Teleport to="body">
      <div
        ref="$content"
        v-if="visible"
        class="n-popover_content"
        :class="classes"
        :style="{ left: `${content.x}px`, top: `${content.y}px` }"
      >
        <div class="inner bg-brand">
          <h1>Content</h1>
        </div>
      </div>
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
    top: 0;
    left: 0;
    max-width: 100%;
    max-height: 100%;

    .inner {
      margin: 4px;
    }
  }

  &_triangle {
    position: fixed;
    top: 0;
    left: 0;
    max-height: 0;
    max-width: 0;
    z-index: 1000;
    border-style: solid;
    border-color: transparent;
    border-width: 4px;

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
}
</style>
