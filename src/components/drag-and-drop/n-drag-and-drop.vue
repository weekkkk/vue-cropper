<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";
import { DragItemModel } from "./model";
const props = defineProps({
  /** Элементы */
  items: { type: Array as PropType<DragItemModel[]>, default: () => [] },
});
/** Обертка */
const $el = ref<HTMLElement>();
/** Элементы для перетаскивания */
const elements = reactive<HTMLElement[]>();

/** Установить элементы для перетаскивания */
setItemRef( el ) {
      if (el) {
        this.itemRefs.push(el)
      }
    }
/** Перетаскиваемый элемент */
const $drag_el = ref<HTMLElement>();
/** Клонировать элемент */
const clone = (e: Event) => {
  if (!$el.value) return;
  e.preventDefault();
  const $t = e.target;
  const children = $el.value.children;
  console.log("clone", e.target);
};
onMounted(() => {
  if (!$el.value) return;
  const children = $el.value.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement;
    if (child) child.addEventListener("mousedown", clone);
  }
});
</script>

<template>
  <div class="n-drag-and-drop" ref="$el">
    <slot v-for="item in items" :key="item.Id" :item="item" />
  </div>
</template>

<style lang="less" scoped></style>
