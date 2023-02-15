<script lang="ts" setup>
import { ref } from 'vue';

import NOption from '@/components/option/n-option.vue';
import { Option } from '@/components/option/models';
import NSelect from '@/components/select/n-select.vue';
import { ESize } from '@/components/enums';

const value = ref();

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
  <!-- <NOption v-model="value" value="1" :size="ESize.Large"> Test </NOption>
  <NOption v-model="value" value="2"> Test </NOption> -->

  <NSelect
    v-model="value"
    :options="[
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]"
    value-key="key"
    name="unicle"
    :size="ESize.Large"
    multi
  >
    <!-- <template #default="{ option }">
      {{ option }}
    </template> -->
  </NSelect>
  {{ value }}
</template>

<style lang="less" scoped></style>
