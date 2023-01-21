<script lang="ts" setup>
import { ref } from 'vue';
import { PositionEnum } from '@/components/popover/enums';
import NPopover from '@/components/popover/n-popover.vue';

const pos = ref(PositionEnum.Auto);
const positions = Object.values(PositionEnum).filter(
  (el) => Number(el) || el == '0'
);
</script>

<template>
  <div class="f cg-3 positions">
    {{ pos }}
    <label class="f cg-1" v-for="ps in positions" :key="ps">
      <input type="radio" v-model="pos" :value="ps" />
      {{ ps }}
    </label>
  </div>
  <NPopover class='test' :position="pos">
    <h2>Element</h2>
  </NPopover>
</template>

<style lang="scss" scoped>
.positions {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
