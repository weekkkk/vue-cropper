<script lang="ts" setup>
import { type PropType, computed } from 'vue';
import NPopover from '../popover/n-popover.vue';
import NInput from '../input/n-input.vue';
import NOption from '../option/n-option.vue';
// import { Option } from '../option/models';
import { EPosition } from '../popover/enums';
import { ESize } from '../enums';
import { EType } from '../option/enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Значение
   */
  modelValue: {
    type: [String, Number, Object, Array<string | number | object>],
    default: undefined,
  },
  /**
   * * Опции
   */
  options: {
    type: Array as PropType<(string | number | object)[]>,
    default: [],
  },
  /**
   * * Ключ уникального значения (если значение объект)
   */
  valueKey: {
    type: String,
    default: undefined,
  },
  /**
   * * Имя группы опций
   */
  name: { type: String, default: 'n-select-option_list' },
  /**
   * * Размер
   */
  size: { type: String as PropType<ESize>, default: ESize.Default },
  /**
   * * Кол-во видимых опций
   */
  rows: {
    type: Number,
    default: 3,
  },
  /**
   * * Включить мультиселект
   */
  multi: { type: Boolean, default: false },
});
/**
 * * События
 */
const emit = defineEmits<{
  (
    e: 'update:modelValue',
    newValue:
      | string
      | number
      | object
      | (string | number | object)[]
      | undefined
  ): void;
}>();
if (props.multi) emit('update:modelValue', []);
/**
 * * Получить значение
 */
function getValue<T>(
  option: string | number | object | (string | number | object)[] | undefined
): string | number | T | undefined {
  let value: string | number | T | undefined = undefined;
  // @ts-ignore
  if (Array.isArray(option)) value = option.map((el) => getValue(el));
  else if (typeof option == 'object') {
    if (props.valueKey && (option as Object).hasOwnProperty(props.valueKey))
      value = option[props.valueKey as keyof object];
    else console.error('Передаете :value-key');
    if (typeof value == 'object') console.error('Ключ не может быть объектом');
  } else value = option;
  return value;
}
/**
 * * Получить опцию
 */
function getOption(value: string | number | undefined) {
  return props.options.find((option) => getValue(option) == value);
}
/**
 * * Значение
 */
const value = computed({
  get: () => getValue<(string | number)[]>(props.modelValue),
  set: (newValue: string | number | (string | number)[] | undefined) => {
    if (Array.isArray(newValue))
      emit(
        'update:modelValue',
        newValue.map((el) => getOption(el))
      );
    else emit('update:modelValue', getOption(newValue));
  },
});
</script>

<template>
  <NPopover class="n-select" width="320px" :position="EPosition.Bottom">
    <NInput :model-value="modelValue?.toString()" :size="size"></NInput>

    <template #content>
      <ul
        class="n-select-option_list"
        :style="{
          '--n-select-rows': rows,
          '--n-option-sz': 'var(--n-ctrl-large-sz)',
        }"
      >
        <NOption
          v-model="value"
          v-for="option in options"
          :key="getValue(option)?.toString()"
          :value="getValue(option)"
          :size="size"
          :name="name"
          :type="multi ? EType.Checkbox : EType.Radio"
        >
          <slot :option="option" />
        </NOption>
      </ul>
    </template>
  </NPopover>
</template>

<style lang="scss">
:root {
  --n-select-rows: 3;
}
</style>

<style lang="scss" scoped>
.n-select {
  &-option_list {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: calc(var(--n-option-sz) * var(--n-select-rows));
  }
}
</style>
