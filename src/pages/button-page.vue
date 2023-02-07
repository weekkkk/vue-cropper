<script lang="ts" setup>
import NButton from '@/components/button/n-button.vue';
import { EColor, ESize } from '@/components/enums';
</script>

<template>
  <section>
    <NButton :color="EColor.Brand" :size="ESize.Large" no-fill>T</NButton>
  </section>
</template>

<style lang="less" scoped></style>
