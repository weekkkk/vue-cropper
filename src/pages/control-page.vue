<script lang="ts" setup>
import { ref } from 'vue';

import NControl from '@/components/control/n-input.vue';
import { EType } from '@/components/control/enums';
import { ESize, EColor } from '@/components/enums';
import NCounter from '@/components/counter/n-counter.vue';
import NButton from '@/components/button/n-button.vue';

const v = ref<number>();
const value = ref('');
const control = ref();
</script>

<template>
  <button @click="control.focus">test</button>

  <div>
    <NButton :color="EColor.Warn" :size="ESize.Large" no-fill square>
      t
    </NButton>
  </div>

  <!-- style="--n-input-br: 0" -->
  <NCounter
    v-model="v"
    placeholder="Test"
    :size="ESize.Large"
    :min="0"
    :max="10"
    :step="3"
  />
    <!-- disabled -->
  <!-- success -->
  <!-- error -->
  <NControl
    ref="control"
    v-model="value"
    :placeholder="`Test\nTest`"
    :rows="5"
    :type="EType.Textarea"
    :size="ESize.Small"
  >
    <!-- disabled -->
    <!-- <template #before> l </template>
    <template #after> r </template> -->
  </NControl>
  {{ value }}
</template>

<style lang="scss" scoped></style>
