<script lang="ts" setup>
const props = defineProps( {
  /**
   * Элементы
   */
  items: {}
})
</script>

<template>
  <div class="n-drag-and-drop">
    <span>
      <slot  />
    </span>
  </div>
</template>

<style lang="less" scoped></style>
