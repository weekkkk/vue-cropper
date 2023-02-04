<script lang="ts" setup>
import { type PropType, computed, ref } from 'vue';
import { EType } from './enums';
import { ESize } from '../enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Значение
   */
  modelValue: { type: [String, Number], required: true },
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
   * * Кол-во строк в комметарии
   */
  rows: { type: Number, default: 3 },
  /**
   * * Тип
   */
  type: { type: String as PropType<EType>, default: EType.Text },
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
  error: { type: Boolean, default: false },
});
/**
 * * События
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'focus', target: HTMLInputElement): void;
  (e: 'blur', target: HTMLInputElement): void;
}>();
/**
 * * Значения
 */
const value = computed<string | number>({
  get: () => props.modelValue,
  set: (value: string | number) => emit('update:modelValue', value),
});
/**
 * * Значение фокуса
 */
const isFocus = ref(false);
/**
 * * При фокусе
 */
function onFocus(e: Event) {
  isFocus.value = true;
  emit('focus', e.target as HTMLInputElement);
}
/**
 * * При снятии фокуса
 */
function onBlur(e: Event) {
  isFocus.value = false;
  emit('blur', e.target as HTMLInputElement);
}
/**
 * * Инпут
 */
const $field = ref<HTMLInputElement | HTMLTextAreaElement>();
/**
 * * Фокус
 */
function focus() {
  if (!$field.value) return;
  $field.value.focus();
}
/**
 * * Снятие фокуса
 */
function blur() {
  if (!$field.value) return;
  $field.value.blur();
}
/**
 * * Поделиться
 */
defineExpose({
  isFocus,
  focus,
  blur,
  $field,
});
</script>

<template>
  <div
    class="n-control"
    :class="[{ focus: isFocus, success, warn, error }, type, size]"
  >
    <slot name="before" />
    <input
      v-if="type != EType.Textarea"
      ref="$field"
      v-model="value"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      @focus="onFocus"
      @blur="onBlur"
      :type="type"
    />
    <textarea
      v-else
      ref="$field"
      v-model="value"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      :rows="rows"
    />
    <slot name="after" />
  </div>
</template>

<style lang="scss">
:root {
  --n-control-small-px: 0.25rem;
  --n-control-default-px: 0.5rem;
  --n-control-large-px: 1rem;
  --n-control-px: 0.5rem;
  --n-control-small-py: 0.125rem;
  --n-control-default-py: 0.25rem;
  --n-control-large-py: 0.5rem;
  --n-control-py: 0.25rem;
  --n-control-br: 0.25rem;
  --n-control-bw: 1px;
  --n-control-small-size: 1.5rem;
  --n-control-default-size: 2rem;
  --n-control-large-size: 2.5rem;
  --n-control-size: var(--n-control-default-size);
  --n-control-bc: var(--n-second-100);
  --n-control-bc-focus: var(--n-brand);
  --n-control-bc-success: var(--n-success);
  --n-control-bc-warn: var(--n-warn);
  --n-control-bc-error: var(--n-danger);
  --n-control-ph: var(--n-second-50);
  --n-control-ts: 0.15s ease-in-out;
}
</style>

<style lang="scss" scoped>
$bw: var(--n-control-bw);
$bc: var(--n-control-bc);
$radius: var(--n-control-br);
$px: var(--n-control-px);
$py: var(--n-control-py);
$size: var(--n-control-size);
$focus: var(--n-control-bc-focus);
$success: var(--n-control-bc-success);
$error: var(--n-control-bc-danger);
$placeholder: var(--n-control-ph);
$transition: var(--n-control-ts);
.n-control {
  display: inline-flex;
  align-items: center;
  border: none;
  padding-left: $px;
  padding-right: $px;
  column-gap: $px;
  outline: $bw solid $bc;
  outline-offset: calc($bw * -1);
  border-radius: $radius;
  transition: $transition;
  input,
  textarea {
    border: none;
    outline: none;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    text-align: inherit;
    width: 100%;
    padding: 0;
    &::placeholder {
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      color: $placeholder;
    }
  }
  input {
    line-height: $size;
    &[type='number'] {
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
  textarea {
    line-height: inherit;
    resize: none;
    height: 100%;
  }
  &.textarea {
    padding-top: $py;
    padding-bottom: $py;
    min-height: $size;
  }
  &.small {
    --n-control-size: var(--n-control-small-size);
    --n-control-px: var(--n-control-small-px);
    --n-control-py: var(--n-control-small-py);
  }
  &.default {
    --n-control-size: var(--n-control-default-size);
    --n-control-px: var(--n-control-default-px);
    --n-control-py: var(--n-control-default-py);
  }
  &.large {
    --n-control-size: var(--n-control-large-size);
    --n-control-px: var(--n-control-large-px);
    --n-control-py: var(--n-control-large-py);
  }
  &.success {
    --n-control-bc: var(--n-control-bc-success);
  }
  &.warn {
    --n-control-bc: var(--n-control-bc-warn);
  }
  &.error {
    --n-control-bc: var(--n-control-bc-error);
  }
  &.focus {
    --n-control-bc: var(--n-control-bc-focus);
  }
}
</style>
