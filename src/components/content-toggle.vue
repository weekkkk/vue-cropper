<script lang="ts" setup>
import { ref } from 'vue';

/**
 * * Видимость
 */
const visible = ref(false);
</script>

<template>
  <div class="f ai-c" @click="visible = !visible" style="cursor: pointer">
    <slot name="title" />
    <h3 class="c-danger">*</h3>
  </div>

  <template v-if="visible">
    <slot />
  </template>
</template>

<style lang="less" scoped></style>
