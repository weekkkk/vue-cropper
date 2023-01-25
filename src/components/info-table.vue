<script lang="ts" setup>
import type { PropType } from 'vue';

/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Строки
   */
  rows: { type: Array as PropType<{ Name: string }[]>, default: [] },
  /**
   * * Какие ключи не отображать
   */
  exclude: { type: Array as PropType<string[]>, default: [] },
  /**
   * * Какие ключи отображаются через слот
   */
  customize: { type: Array as PropType<string[]>, default: [] },
});
</script>

<template>
  <table class="info-table ta-l bc-brand fs-small-p">
    <tr>
      <template v-for="key in Object.keys(rows[0])" :key="key">
        <th class="fw-medium" v-if="!exclude.includes(key)">
          {{ key.toLowerCase() }}
        </th>
      </template>
    </tr>

    <tr v-for="row in rows" :key="row.Name" class="c-second-100">
      <template v-for="key in Object.keys(rows[0])" :key="key">
        <td v-if="!exclude.includes(key)">
          <template v-if="!customize.includes(key)">
            <i v-if="key == 'Description'" class="fs-small-p">
              {{ row[key as keyof {}] }}
            </i>
            <span
              v-else
              :class="{
                'c-base': key == 'Name' || key == 'Default',
              }"
            >
              {{ row[key as keyof {}] }}
            </span>
          </template>
          <template v-else>
            <slot :key="key" :value="row[key as keyof {}]" :row="row" />
          </template>
        </td>
      </template>
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
