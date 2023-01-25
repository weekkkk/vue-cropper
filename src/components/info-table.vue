<script lang="ts" setup>
import type { PropType } from 'vue';
import { type Info, Type } from '@/models';
import NPopover from './popover/n-popover.vue';
/**
 * * Свойства
 */
const props = defineProps({
  /**
   * * Строки
   */
  rows: { type: Array as PropType<Info[]>, default: [] },
});
</script>

<template>
  <div class="info-table f fd-col">
    <table class="ta-l fs-small-p">
      <tr>
        <template v-for="key in Object.keys(rows[0])" :key="key">
          <th class="fw-medium" v-if="rows[0][key as keyof Info]">
            {{ key.toLowerCase() }}
          </th>
        </template>
      </tr>

      <tr v-for="row in rows" :key="row.Name">
        <template v-for="key in Object.keys(rows[0])" :key="key">
          <td v-if="rows[0][key as keyof Info]" :class="key.toLowerCase()">
            <mark
              v-if="key == 'Type' && typeof row[ key as keyof Info ] == 'string'"
              class="fs-p bg-second-0 c-second-100"
            >
              {{ row[key as keyof Info] }}
            </mark>
            <NPopover
              v-else-if="key == 'Type' && row[ key as keyof Info ] instanceof Type"
              width="max-content"
              classes="p-2"
            >
              <mark class="bg-second-0 c-second-100">
                {{ (row[key as keyof Info] as Type).Name }}
              </mark>
              <p class="c-danger fw-medium">*</p>
              <template #content>
                <mark
                  class="bg-second-0 c-second-100 fs-small-p"
                  style="letter-spacing: 2px"
                >
                  {{ (row[key as keyof Info] as Type).FullName }}
                </mark>
              </template>
            </NPopover>
            <i v-else-if="key == 'Description'" class="c-second-100">
              {{ row[key as keyof Info] }}
            </i>
            <span v-else>
              {{ row[key as keyof Info] }}
            </span>
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.info-table {
  overflow: auto;
  border: 1px solid var(--n-second-40);

  td {
    &.name,
    &.type {
      white-space: nowrap;
      letter-spacing: 2px;
    }
  }
}
</style>
