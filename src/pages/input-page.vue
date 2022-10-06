<template>
  <!-- <n-control v-model="value" size='small' placeholder="placeholder"></n-control> -->
  <n-input label="label" v-model="value" placeholder="placeholder" success error disabled></n-input>
  {{ value }}
</template>

<script setup lang="ts">
import { ref } from "vue";
import NInput from "@/components/input/n-input.vue";
import NControl from "@/components/control/n-control.vue";
const value = ref("");
</script>

<style lang="less" scoped></style>
