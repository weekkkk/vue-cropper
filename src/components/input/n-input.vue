<template>
  <div class="n-input">
    <label> {{ label }}</label>
    <n-control
      :model-value="modelValue"
      @update:model-value="onUpdate"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :error="error"
      :success="success"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { SizeEnum } from "../control/enums";
import NControl from "../control/n-control.vue";
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
   * Подпись
   */
  label: { type: String, default: "" },
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
const emit = defineEmits(["update:modelValue"]);
/**
 * При обновлении значения
 */
const onUpdate = (value: string | number) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
  .n-input {
    display: flex;
    flex-direction: column;
    row-gap: var(--n-control-row-gap);
    label {
      color: var(--n-signature);
      font-size: var(--n-label-font-size);
      line-height: var(--n-label-line-height);
      font-weight: var(--n-label-font-weight);
    }
  }
</style>
