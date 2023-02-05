<script lang="ts" setup>
import { type PropType, ref, computed } from 'vue';
import NInput from '../control/n-input.vue';
import { EType } from '../control/enums';
import { EColor, ESize } from '../enums';
import NButton from '../button/n-button.vue';
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
  /**
   * * Успех
   */
  success: { type: Boolean, default: false },
  /**
   * * Предупеждение
   */
  warn: { type: Boolean, default: false },
  /**
   * * Ошибка
   */
  danger: { type: Boolean, default: false },
  /**
   * * Неактивность
   */
  disabled: { type: Boolean, default: false },
});
/**
 * * События
 */
const emit = defineEmits<{
  (e: 'update:modelValue', newValue: number | undefined): void;
  (e: 'up', newValue: number | undefined): void;
  (e: 'down', newValue: number | undefined): void;
}>();
/**
 * * Контрол
 */
const control = ref<InstanceType<typeof NInput>>();
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
  input.stepDown();
  update(Number(input.value));
  emit('down', props.modelValue);
}
/**
 * * Больше
 */
function up() {
  const input = control.value?.$field as HTMLInputElement;
  input.stepUp();
  update(Number(input.value));
  emit('up', props.modelValue);
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
}
function onFocus() {
  console.log('onFocus');
}
/**
 * * Минильно ли значение
 */
const isMin = computed(
  () =>
    props.min != undefined &&
    props.modelValue != undefined &&
    props.modelValue - props.step < props.min
);
/**
 * * Максимально ли значение
 */
const isMax = computed(
  () =>
    props.max != undefined &&
    props.modelValue != undefined &&
    props.modelValue + props.step > props.max
);
</script>

<template>
  <NInput
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
    :success="success"
    :warn="warn"
    :danger="danger"
    :disabled="disabled"
  >
    <template #before>
      <div class="n-counter-action_before lh-no fw-medium fs-h2">
        <NButton
          @click="down"
          @mousedown.prevent="control?.focus"
          :color="EColor.Brand"
          :size="size"
          :disabled="disabled || isMin"
          square
          no-fill
        >
          -
        </NButton>
      </div>
    </template>
    <template #after>
      <div class="n-counter-action_after lh-no fw-medium fs-h2">
        <NButton
          @click="up"
          @mousedown.prevent="control?.focus"
          :color="EColor.Brand"
          :size="size"
          :disabled="disabled || isMax"
          square
          no-fill
        >
          +
        </NButton>
      </div>
    </template>
  </NInput>
</template>

<style lang="scss" scoped>
$bw: var(--n-input-bw);
$px: var(--n-input-px);
$sz: var(--n-input-sz);
$bc: var(--n-ctrl-bc);
.n-counter {
  text-align: center;
  overflow: hidden;
  min-width: calc($sz * 3);
  --n-input-px: var(--n-input-py);
  &-action {
    &_before,
    &_after {
      --n-button-bw: 0;
      outline: $bw solid $bc;
      outline-offset: calc($bw * -1);
    }
    &_before {
      margin-left: calc($px * -1);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &_after {
      margin-right: calc($px * -1);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
