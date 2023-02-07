<script lang="ts" setup>
import { ref } from 'vue';

import NOption from '@/components/option/n-option.vue';
import { Option } from '@/components/option/models';
import NSelect from '@/components/select/n-select.vue';
import { ESize } from '@/components/enums';

const value = ref('1');

const options = ref<Option[]>([]);

for (let i = 1; i < 20; i++) {
  options.value.push(
    new Option({
      Id: i,
      Text: `Option ${i}`,
    })
  );
}
</script>

<template>
  {{ value }}
  <NOption v-model="value" value="1" :size="ESize.Large"> Test </NOption>
  <NOption v-model="value" value="2"> Test </NOption>

  <NSelect :options="options" :size="ESize.Large">
    <!-- <template #default="{ option }">
      {{ option }}
    </template> -->
  </NSelect>
</template>

<style lang="less" scoped></style>
