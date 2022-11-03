<script lang="ts" setup>

</script>

<template>
  <div class="n-wrap">
    <div class="n-item" v-for="i in 20" :key="i">
      {{ i }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .n-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(100% / 3 - 32px / 3);
    height: 400px;
    background-color: var(--n-main);
    user-select: none;
  }
}
</style>
