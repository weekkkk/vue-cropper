<script lang="ts" setup>
import { type PropType, ref, computed } from 'vue';
import type { IFunction } from './interfaces';
import { EMode, EType } from './enums';
import NDrag from './n-drag.vue';

/**
 * * Вставить элемент
 * @param fromIndex - Откуда вставить
 * @param toIndex - Куда вставить
 * @param elements - Массив для изменения
 */
const insert: IFunction = (fromIndex, toIndex, elements) => {
  const center = elements.splice(fromIndex, 1);
  const start = elements.splice(0, toIndex);
  elements.unshift(...center);
  elements.unshift(...start);
  console.log('insert', { fromIndex, toIndex, elements });
  return elements;
};
/**
 * * Вставить элемент
 * @param fromIndex - Откуда вставить
 * @param toIndex - Куда вставить
 * @param elements - Массив для изменения
 */
const swap: IFunction = (fromIndex, toIndex, elements) => {
  const fromValue = elements[fromIndex];
  const toValue = elements[toIndex];
  elements[fromIndex] = toValue;
  elements[toIndex] = fromValue;

  console.log('swap', { fromIndex, toIndex, elements });
  return elements;
};

/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Тип перетаскивания
   */
  mode: { type: String as PropType<EMode>, default: EMode.Record },
  /**
   * * Тип изменения
   */
  type: { type: String as PropType<EType>, default: EType.Insert },
  /**
   * * Значения
   */
  ids: { type: Array as PropType<number[]>, default: [] },
  /**
   * * Классы элементов группы
   */
  classes: { type: String, default: '' },
  /**
   * * Кол-во колонок
   */
  columns: { type: Number, default: 3 },
});

const _ids = ref(props.ids.slice());

/**
 * * ID перемещаемого элемента
 */
const fromId = ref<number>();
const fromIndex = computed(() =>
  fromId.value != undefined ? _ids.value.indexOf(fromId.value) : undefined
);
/**
 * * ID элемента на место которого перемещают
 */
const toId = ref<number>();
const toIndex = computed(() =>
  toId.value != undefined ? _ids.value.indexOf(toId.value) : undefined
);
/**
 * * Элемента на место которого перемещают
 */
const toElement = ref<HTMLElement>();

/**
 * * Начало перетаскивания элемента
 * @param target - Элемент, который перетаскивают
 * @param id - ID элемента, который перетаскивают
 */
function start(target: HTMLElement | undefined, id: number) {
  const index = _ids.value.indexOf(id);
  if (index == -1) return;
  fromId.value = id;
  console.log('start', { target, id, index });
}

/**
 * * При наведении на другой элемент
 * @param target - Элемент, который перетаскивают
 * @param id - ID элемента, который перетаскивают
 */
function enter(target: HTMLElement | undefined, id: number) {
  if (fromId.value == undefined || fromIndex.value == undefined) return;
  const index = _ids.value.indexOf(id);

  if (
    index == -1 ||
    id == fromId.value ||
    id == toId.value ||
    (index == fromIndex.value - 1 &&
      target?.classList.contains('separator') &&
      !target?.classList.contains('left'))
  )
    return;
  toId.value = id;

  if (target?.classList.contains('separator')) {
    toElement.value?.classList.remove('insert');
    toElement.value = target;
    toElement.value?.classList.add('insert');
  } else {
    toElement.value = target;
  }

  console.log('enter', { target, id, index });

  if (props.mode == EMode.Live) action();
}

/**
 * * При снятии наведения с элемента
 * @param target - Элемент, на который ушли
 * @param id - ID элемента, с которого ушли
 */
function leave(target: HTMLElement | undefined, id: number) {
  if (props.mode == EMode.Live) return;
  toId.value = undefined;
  toElement.value?.classList.remove('insert');
  toElement.value = undefined;
  _ids.value = props.ids.slice(0);
}

/**
 * * При остановке перетаскивания
 * @param target - Элемент
 * @param id - ID элемента
 */
function stop(target: HTMLElement | undefined, id: number) {
  action();
  toId.value = undefined;
  fromId.value = undefined;
  toElement.value?.classList.remove('insert');
  toElement.value = undefined;
  // leave(target, id);
}

/**
 * * Действия выбполняемые после инициализации fromIndex и toIndex
 */
function action() {
  if (
    fromIndex.value == undefined ||
    toIndex.value == undefined ||
    fromId.value == undefined ||
    !toElement.value
  )
    return;
  switch (props.type) {
    case EType.Insert:
      switch (props.mode) {
        case EMode.Live:
          insert(fromIndex.value, toIndex.value, _ids.value);
          return;
        case EMode.Record:
          let _toIndex = toIndex.value;
          if (
            _toIndex < fromIndex.value &&
            !toElement.value?.classList.contains('left')
          )
            _toIndex++;
          insert(fromIndex.value, _toIndex, _ids.value);
          return;
      }
      return;
    case EType.Swap:
      const _fromIndex = fromIndex.value;
      const _toIndex = toIndex.value;
      console.log({ from: fromId.value, to: toId.value });
      _ids.value = props.ids.slice(0);
      if (_ids.value.indexOf(fromId.value) == _toIndex) return;
      swap(_fromIndex, _toIndex, _ids.value);
      return;
  }
}
</script>

<template>
  <TransitionGroup
    tag="div"
    name="n-drag-group_anim"
    class="n-drag-group"
    :class="[type, mode]"
  >
    <template v-for="(id, index) in _ids" :key="index" :data-index="index">
      <div
        v-if="
          type == EType.Insert && mode == EMode.Record && index % columns == 0
        "
        class="separator droppable left"
        :id="id.toString()"
      />
      <NDrag
        @start="start"
        @stop="stop"
        @enter="enter"
        @leave="leave"
        :id="id.toString()"
        classes="n-drag-group_element"
        :class="[
          {
            droppable: !(type == EType.Insert && mode == EMode.Record),
          },
          classes,
        ]"
      >
        <slot :id="id" :index="index" />
      </NDrag>
      <div
        v-if="type == EType.Insert && mode == EMode.Record"
        :id="id.toString()"
        class="separator droppable"
      />
    </template>
  </TransitionGroup>
</template>

<style lang="scss">
:root {
  --n-drag-group-cg: 32px;
  --n-drag-group-rg: 16px;
  --n-drag-group-px: 16px;
  --n-drag-group-py: 32px;
}
.n-drag-group {
  $cg: var(--n-drag-group-cg);
  $rg: var(--n-drag-group-rg);
  $px: var(--n-drag-group-px);
  $py: var(--n-drag-group-py);
  $columns: v-bind(columns);

  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: $rg;
  padding: $py $px;
  border: 1px solid gray;

  &:not(.insert.record) {
    column-gap: $cg;
    .n-drag-group_element {
      width: calc((100% - $cg * ($columns - 1)) / $columns);
    }
  }

  &_element {
    border: 2px solid blue;
    overflow: hidden;
    width: calc((100% - $cg * $columns - $cg) / $columns);
    height: 100px;
    background: gray;
    opacity: 0.3;
  }

  .separator {
    width: $cg;
    height: 50px;
    background-color: gray;
    &.insert {
      background-color: red;
    }
  }

  &_anim-move,
  &_anim-enter-active,
  &_anim-leave-active {
    // transition: transform 2s ease;
  }

  &_anim-enter-from,
  &_anim-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  &_anim-leave-active {
    position: absolute;
  }
}
</style>
