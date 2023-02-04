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
  console.log('focus');
  isFocus.value = true;
  emit('focus', e.target as HTMLInputElement);
}
/**
 * * При снятии фокуса
 */
function onBlur(e: Event) {
  console.log('blur');
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
  focus,
  blur,
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
  --n-control-small-px: 4px;
  --n-control-default-px: 8px;
  --n-control-large-px: 16px;
  --n-control-px: 8px;
  --n-control-small-py: 2px;
  --n-control-default-py: 4px;
  --n-control-large-py: 8px;
  --n-control-py: 4px;
  --n-control-br: 4px;
  --n-control-bw: 1px;
  --n-control-small-size: 24px;
  --n-control-default-size: 32px;
  --n-control-large-size: 40px;
  --n-control-size: 32px;
  --n-control-bc: var(--n-second-100);
  --n-control-bc-focus: var(--n-brand);
  --n-control-bc-success: var(--n-success);
  --n-control-bc-warn: var(--n-warn);
  --n-control-bc-error: var(--n-danger);
  --n-control-ph: var(--n-second-50);
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
  input,
  textarea {
    border: none;
    outline: none;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    width: 100%;
    padding: 0;
    &::placeholder {
      color: $placeholder;
    }
  }
  input {
    line-height: $size;
  }
  textarea {
    line-height: inherit;
    resize: none;
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
