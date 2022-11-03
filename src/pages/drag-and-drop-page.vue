<script lang="ts" setup>
import { reactive } from "vue";
import NDragAndDrop from "@/components/drag-and-drop/n-drag-and-drop.vue";
import { DragItemModel } from "@/components/drag-and-drop/model";

const items: DragItemModel[] = reactive([]);
for (let i = 1; i <= 10; i++) items.push(new DragItemModel({ Id: i }));
</script>

<template>
  <!-- <div class="n-wrap">
    <div class="n-item" v-for="i in 20" :key="i">
      {{ i }}
    </div>
  </div> -->
  <n-drag-and-drop class="n-wrap" :items="items">
    <template #default="{ item }">
      <span :class="`n-item ${item.Id % 3}`">
        {{ item.Id }}
      </span>
    </template>
  </n-drag-and-drop>
</template>

<style lang="sass" scoped>
.n-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .n-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    background-color: var(--n-main);
    user-select: none;
    &.1 {
      width: calc(100% / 3 - 32px / 3);
    }
  }
}
</style>
