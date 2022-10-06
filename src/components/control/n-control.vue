<template>
  <span
    class="n-control"
    :class="[
      {
        'is-success': success,
        'is-error': error,
        'is-focus': focus,
        'is-disabled': disabled,
      },
      `is-${size}`,
    ]"
  >
    <input
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { SizeEnum } from "./enums";
const props = defineProps({
  /**
   * Значение
   */
  modelValue: { type: [String, Number], default: "" },
  /**
   * Размер
   */
  size: { type: String as PropType<SizeEnum>, default: SizeEnum.Default },
  /**
   * Заполнитель
   */
  placeholder: { type: String, default: "" },
  /**
   * Тип
   */
  type: { type: String as PropType<"text" | "number">, default: "text" },
  /**
   * Не активный
   */
  disabled: { type: Boolean, default: false },
  /**
   * Ошибка
   */
  error: { type: Boolean, default: false },
  /**
   * Успех
   */
  success: { type: Boolean, default: false },
});
/**
 * События
 */
const emit = defineEmits(["focus", "blur", "update:modelValue"]);
/**
 * Фокус
 */
const focus = ref(false);
/**
 * При фокусе
 */
const onFocus = () => {
  focus.value = true;
  emit("focus");
};
/**
 * Снятие фокуса
 */
const onBlur = () => {
  focus.value = false;
  emit("blur");
};
/**
 * Обработчик ввода
 */
const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>

<style lang="scss" scoped>
.n-control {
  border-style: solid;
  border-width: var(--n-border-width);
  border-color: var(--n-border);
  border-radius: var(--n-radius);
  display: flex;
  align-items: center;
  column-gap: var(--n-control-col-gap);
  padding: 0 var(--n-control-default-px);
  background-color: var(--n-control-background);
  transition-duration: var(--n-transition-duration);
  transition-timing-function: var(--n-transition-timing-function);
  input {
    border: none;
    background: none;
    outline: none;
    font-size: inherit;
    line-height: var(--n-control-default-size);
    margin: calc(var(--n-border-width) * -1) 0;
    color: inherit;
    width: 100%;
    &::placeholder {
      color: var(--n-placeholder);
    }
  }
  &.is-large {
    padding: 0 var(--n-control-large-px);
    input {
      line-height: var(--n-control-large-size);
    }
  }
  &.is-small {
    padding: 0 var(--n-control-small-px);
    input {
      line-height: var(--n-control-small-size);
    }
  }

  &.is-success {
    border-color: var(--n-success);
  }
  &.is-error {
    border-color: var(--n-error);
  }
  &.is-focus {
    border-color: var(--n-main);
  }
  &.is-disabled {
    border-color: var(--n-border);
    background-color: var(--n-control-background-disabled);
    input {
      cursor: not-allowed;
    }
  }
}
</style>
