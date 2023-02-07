<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import NPopover from '../popover/n-popover.vue';
import NInput from '../input/n-input.vue';
import NOption from '../option/n-option.vue';
import type { Option } from '../option/models';
import { EPosition } from '../popover/enums';
import { ESize } from '../enums';
import { EType } from '../option/enums';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Опции
   */
  options: {
    type: Array as PropType<Option[]>,
    default: [],
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

const test = ref<string | string[] | undefined>(props.multi ? [] : undefined);
</script>

<template>
  <NPopover class="n-select" width="320px" :position="EPosition.Bottom">
    <NInput :model-value="test?.toString()" :size="size"></NInput>

    <template #content>
      <section
        class="n-select-option_list"
        :style="{
          '--n-select-rows': rows,
          '--n-option-sz': 'var(--n-ctrl-large-sz)',
        }"
      >
        <NOption
          v-model="test"
          v-for="option in options"
          :value="option.Id + ''"
          :size="size"
          :name="name"
          :type="multi ? EType.Checkbox : EType.Radio"
        >
          <slot :option="option">
            {{ option.Text }}
          </slot>
        </NOption>
      </section>
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
