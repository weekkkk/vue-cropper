<script lang="ts" setup>
import { ref } from 'vue';

import NControl from '@/components/control/n-control.vue';
import { EType } from '@/components/control/enums';
import { ESize } from '@/components/enums';
import NCounter from '@/components/counter/n-counter.vue';

const v = ref<number>();
const value = ref('');
const control = ref();
</script>

<template>
  <button @click="control.focus">test</button>
  <NCounter
    v-model="v"
    placeholder="Test"
    :size="ESize.Large"
    :min="0"
    :max="10"
    :step="3"
  />
  <!-- error -->
  <NControl
    ref="control"
    v-model="value"
    :placeholder="`Test\nTest`"
    :rows="5"
    :type="EType.Textarea"
    :size="ESize.Small"
  >
    <!-- <template #before> l </template>
    <template #after> r </template> -->
  </NControl>
  {{ value }}
</template>

<style lang="scss" scoped></style>
