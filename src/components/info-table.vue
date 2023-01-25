<script lang="ts" setup>
import type { PropType } from 'vue';

/** Свойства */
const props = defineProps({
  /** Строки */
  rows: { type: Array as PropType<{ Name: string }[]>, default: [] },
});
</script>

<template>
  <table class="info-table ta-l bc-brand fs-small-p">
    <tr>
      <th class="fw-medium" v-for="key in Object.keys(rows[0])" :key="key">
        {{ key.toLowerCase() }}
      </th>
    </tr>

    <tr v-for="row in rows" :key="row.Name" class="c-second-100">
      <td v-for="key in Object.keys(row)" :key="key">
        <i v-if="key == 'Description'" class="fs-small-p">
          {{ row[key as keyof {}] }}
        </i>
        <span
          v-else
          :class="{
            'bg-second-0 px-1 fs-p': key == 'Type',
            'c-base': key == 'Name' || key == 'Default',
          }"
        >
          {{ row[key as keyof {}] }}
        </span>
      </td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
table.info-table {
  $border: 1px solid var(--n-second-20);
  border-collapse: collapse;
  border: $border;
  tr {
    td,
    th {
      vertical-align: top;
      padding: var(--n-indent-3);
      &:not(:last-child) {
        border-right: $border;
      }
    }
    &:not(:last-child) {
      td,
      th {
        border-bottom: $border;
      }
    }
  }
}
</style>
