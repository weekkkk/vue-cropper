<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import NControl from '../control/n-control.vue';
import { EType } from '../control/enums';
import { ESize } from '../enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Значения
   */
  modelValue: { type: Number, default: undefined },
  /**
   * * Заполнитель
   */
  placeholder: { type: String, default: '' },
  /**
   * * Минимум
   */
  min: { type: Number, default: undefined },
  /**
   * * Максимум
   */
  max: { type: Number, default: undefined },
  /**
   * * Шаг
   */
  step: { type: Number, default: 1 },
  /**
   * * Размер
   */
  size: { type: String as PropType<ESize>, default: ESize.Default },
});
/**
 * * События
 */
const emit = defineEmits<{
  (e: 'update:modelValue', newValue: number | undefined): void;
}>();
/**
 * * Контрол
 */
const control = ref<InstanceType<typeof NControl>>();
/**
 * * Обновление значения
 */
function update(value: number | string) {
  let newValue: string | number | undefined = value;
  if (typeof newValue == 'string') newValue = undefined;
  emit('update:modelValue', newValue);
}
/**
 * * Меньше
 */
function down() {
  const input = control.value?.$field as HTMLInputElement;
  // input.focus();
  input.stepDown();
  update(Number(input.value));
}
/**
 * * Больше
 */
function up() {
  const input = control.value?.$field as HTMLInputElement;
  // input.focus();
  input.stepUp();
  update(Number(input.value));
}
/**
 * * При снятии фокуса
 */
function onBlur(input: HTMLInputElement) {
  let value = props.modelValue;
  if (value == undefined) return;
  if (props.max != undefined && value > props.max) {
    input.stepDown();
    update(Number(input.value));
  } else if (props.min != undefined && value < props.min) {
    input.stepUp();
    update(Number(input.value));
  }
  console.log('onBlur');
}

function onFocus() {
  console.log('onFocus');
}
</script>

<template>
  <NControl
    class="n-counter"
    ref="control"
    :model-value="modelValue == undefined ? '' : modelValue"
    @update:model-value="update($event)"
    @blur="onBlur"
    @focus="onFocus"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
    :size="size"
    :type="EType.Number"
  >
    <template #before>
      <button
        class="action before"
        @click="down"
        @mousedown.prevent="control?.focus"
      >
        -
      </button>
    </template>
    <template #after>
      <button
        class="action after"
        @click="up"
        @mousedown.prevent="control?.focus"
      >
        +
      </button>
    </template>
  </NControl>
</template>

<style lang="scss" scoped>
.n-counter {
  text-align: center;
  overflow: hidden;
  .action {
    border: none;
    border-radius: 0;
    height: 100%;
    &.before {
      margin-left: calc(var(--n-control-px) * -1);
    }
    &.after {
      margin-right: calc(var(--n-control-px) * -1);
    }
  }
}
</style>
