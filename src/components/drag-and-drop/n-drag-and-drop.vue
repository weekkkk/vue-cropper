<script lang="ts" setup>
import { PropType } from "vue";
import { DragItemModel } from "./model";
const props = defineProps({
  /**
   * Элементы
   */
  items: { type: Array as PropType<DragItemModel[]>, default: () => [] },
});
</script>

<template>
  <div class="n-drag-and-drop">
    <slot v-for="item in items" :key="item.Id" :item="item" />
  </div>
</template>

<style lang="less" scoped></style>
