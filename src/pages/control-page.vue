<script lang="ts" setup>
import { ref } from 'vue';

import NControl from '@/components/control/n-control.vue';
import { EType } from '@/components/control/enums';
import { ESize } from '@/components/enums';

const value = ref('');
const control = ref();
</script>

<template>
  <button @click="control.focus">test</button>
  <!-- error -->
  <NControl
    ref="control"
    v-model="value"
    placeholder="Test"
    :rows="1"
    :type="EType.Textarea"
    :size="ESize.Large"
  >
    <!-- <template #before> l </template>
    <template #after> r </template> -->
  </NControl>
  {{ value }}
</template>

<style lang="scss" scoped></style>
