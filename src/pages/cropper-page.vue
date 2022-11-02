<template>
  <n-cropper v-model="image" :src="src"></n-cropper>
  <!-- <input type="file"> -->
  <tir-file-input v-model="src">
    <button>input</button>
  </tir-file-input>
  <img :src="image" alt="" />
  <img :src="src" alt="" />
</template>

<script lang="ts" setup>
import NCropper from "@/components/cropper/n-cropper.vue";
import TirFileInput from "vue3-tir-file-input";
import { ref } from "vue";
const src = ref("");
const image = ref("");
</script>

<style lang="less" scoped></style>
