<script lang="ts" setup>
import { ref } from 'vue';
import NDragGroup from '@/components/drag/n-drag-group.vue';

const ids = ref<number[]>([]);
for (let i = 0; i < 10; i++) {
  ids.value.push(i);
}
</script>

<template>
  <NDragGroup :ids="ids" classes="group_el">
    <template #default="slot">
      <h1>{{ slot.id }}</h1>
    </template>
  </NDragGroup>
</template>

<style lang="scss" scoped>
.group {
  &_el {
    width: calc(100% / 5);
  }
}
</style>
